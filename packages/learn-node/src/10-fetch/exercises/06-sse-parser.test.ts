import { once } from 'node:events';
import { createServer, type Server } from 'node:http';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { loadImpl } from '../../shared/load-impl.js';

const impl = await loadImpl({
  exercise: () => import('./06-sse-parser.js'),
  solution: () => import('./solutions/06-sse-parser.js'),
});

describe('parseSse', () => {
  let server: Server;
  let baseUrl: string;

  beforeAll(async () => {
    server = createServer((req, res) => {
      const url = new URL(req.url ?? '/', 'http://localhost');

      if (url.pathname === '/sse') {
        res.writeHead(200, {
          'content-type': 'text/event-stream',
          'cache-control': 'no-cache',
          connection: 'keep-alive',
        });
        res.write(': welcome\n\n');
        res.write('event: message\ndata: hello\n\n');
        setTimeout(() => {
          res.write('event: message\ndata: line1\ndata: line2\nid: 42\n\n');
          setTimeout(() => {
            res.write('event: done\ndata: {"ok":true}\n\n');
            res.end();
          }, 5);
        }, 5);
        return;
      }

      res.writeHead(404);
      res.end();
    });

    server.listen(0, '127.0.0.1');
    await once(server, 'listening');
    const address = server.address();
    if (!address || typeof address === 'string') {
      throw new Error('服务器启动失败');
    }
    baseUrl = `http://127.0.0.1:${address.port}`;
  });

  afterAll(async () => {
    const closed = once(server, 'close');
    server.close();
    server.closeAllConnections();
    await closed;
  });

  it('解析 SSE 消息并跳过注释', async () => {
    const events: Array<{ event?: string; data: string; id?: string }> = [];

    for await (const event of impl.parseSse(`${baseUrl}/sse`)) {
      events.push(event);
    }

    expect(events).toEqual([
      { event: 'message', data: 'hello' },
      { event: 'message', data: 'line1\nline2', id: '42' },
      { event: 'done', data: '{"ok":true}' },
    ]);
  });

  it('非 2xx 抛错', async () => {
    await expect(
      (async () => {
        for await (const _ of impl.parseSse(`${baseUrl}/missing`)) {
          // consume
        }
      })(),
    ).rejects.toThrowError('HTTP 404');
  });
});
