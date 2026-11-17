import { once } from 'node:events';
import { createServer, type Server } from 'node:net';
import { setTimeout as sleep } from 'node:timers/promises';
import { describe, expect, it } from 'vitest';
import { loadImpl } from '../../../shared/load-impl.js';

const impl = await loadImpl({
  exercise: () => import('../05-wait-for-port.js'),
  solution: () => import('../solutions/05-wait-for-port.js'),
});

async function freePort(): Promise<number> {
  const server = createServer();
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const address = server.address();
  if (!address || typeof address === 'string') {
    throw new Error('无法获取空闲端口');
  }
  const port = address.port;
  const closed = once(server, 'close');
  server.close();
  await closed;
  return port;
}

describe('waitForPort', () => {
  it('等待稍后启动的服务器', async () => {
    const server = createServer();
    const port = await freePort();
    const started = sleep(30).then(async () => {
      server.listen(port, '127.0.0.1');
      await once(server, 'listening');
    });

    try {
      await impl.waitForPort(port, { timeoutMs: 2000, intervalMs: 10 });
      await started;
    } finally {
      const closed = once(server, 'close');
      server.close();
      await closed;
    }
  });

  it('已经监听时立即成功', async () => {
    const server = createServer();
    server.listen(0, '127.0.0.1');
    await once(server, 'listening');
    const address = server.address();
    if (!address || typeof address === 'string') {
      throw new Error('服务器启动失败');
    }

    try {
      await expect(
        impl.waitForPort(address.port, { timeoutMs: 500 }),
      ).resolves.toBeUndefined();
    } finally {
      const closed = once(server, 'close');
      server.close();
      await closed;
    }
  });

  it('超时后拒绝', async () => {
    const port = await freePort();

    await expect(
      impl.waitForPort(port, { timeoutMs: 50, intervalMs: 10 }),
    ).rejects.toThrowError(`等待端口 127.0.0.1:${port} 超时（50ms）`);
  });

  it('拒绝非法参数', async () => {
    await expect(impl.waitForPort(0)).rejects.toBeInstanceOf(RangeError);
    await expect(
      impl.waitForPort(3000, { timeoutMs: 0 }),
    ).rejects.toBeInstanceOf(RangeError);
    await expect(
      impl.waitForPort(3000, { intervalMs: -1 }),
    ).rejects.toBeInstanceOf(RangeError);
  });
});
