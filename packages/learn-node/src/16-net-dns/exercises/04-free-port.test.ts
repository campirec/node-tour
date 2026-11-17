import { once } from 'node:events';
import { createServer } from 'node:net';
import { describe, expect, it } from 'vitest';
import { loadImpl } from '../../shared/load-impl.js';

const impl = await loadImpl({
  exercise: () => import('./04-free-port.js'),
  solution: () => import('./solutions/04-free-port.js'),
});

describe('getFreePort / isPortAvailable', () => {
  it('返回有效端口并检测占用状态', async () => {
    const port = await impl.getFreePort();
    expect(port).toBeGreaterThan(0);
    expect(port).toBeLessThanOrEqual(65_535);

    const server = createServer();
    server.listen(port, '127.0.0.1');
    await once(server, 'listening');

    try {
      await expect(impl.isPortAvailable(port)).resolves.toBe(false);
    } finally {
      const closed = once(server, 'close');
      server.close();
      await closed;
    }

    await expect(impl.isPortAvailable(port)).resolves.toBe(true);
  });

  it('拒绝非法端口', async () => {
    await expect(impl.isPortAvailable(0)).rejects.toBeInstanceOf(RangeError);
    await expect(
      impl.isPortAvailable(70_000),
    ).rejects.toBeInstanceOf(RangeError);
    await expect(
      impl.isPortAvailable(1.5),
    ).rejects.toBeInstanceOf(RangeError);
  });
});
