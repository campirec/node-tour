import { once } from 'node:events';
import { createConnection } from 'node:net';
import { describe, expect, it } from 'vitest';
import { loadImpl } from '../../../shared/load-impl.js';

const impl = await loadImpl({
  exercise: () => import('../01-echo-server.js'),
  solution: () => import('../solutions/01-echo-server.js'),
});

describe('startEchoServer', () => {
  it('回写客户端发送的字节', async () => {
    const server = await impl.startEchoServer();
    const socket = createConnection({
      port: server.port,
      host: '127.0.0.1',
    });

    try {
      await once(socket, 'connect');
      const data = once(socket, 'data');
      socket.write('ping 你好');
      const [chunk] = await data;

      expect(chunk.toString('utf8')).toBe('ping 你好');
    } finally {
      socket.destroy();
      await server.close();
    }
  });
});
