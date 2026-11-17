import { once } from 'node:events';
import { createServer, type Server } from 'node:http';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { loadImpl } from '../../../shared/load-impl.js';

const impl = await loadImpl({
  exercise: () => import('../03-stream-lines.js'),
  solution: () => import('../solutions/03-stream-lines.js'),
});

describe('streamLines', () => {
  let server: Server;
  let baseUrl: string;

  beforeAll(async () => {
    server = createServer((request, response) => {
      const path = new URL(request.url ?? '/', 'http://localhost').pathname;

      if (path === '/stream') {
        response.writeHead(200, {
          'content-type': 'text/plain; charset=utf-8',
        });
        const data = Buffer.from('第一行\r\n第二行\n\n最后一行', 'utf8');
        response.write(data.subarray(0, 4));
        setTimeout(() => {
          response.write(data.subarray(4, 20));
          setTimeout(() => {
            response.end(data.subarray(20));
          }, 5);
        }, 5);
        return;
      }

      response.writeHead(404);
      response.end();
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

  it('跨 chunk 流式解析，处理 CRLF、空行与末尾无换行', async () => {
    const lines: string[] = [];
    for await (const line of impl.streamLines(`${baseUrl}/stream`)) {
      lines.push(line);
    }

    expect(lines).toEqual(['第一行', '第二行', '', '最后一行']);
  });

  it('非 2xx 抛出错误', async () => {
    const iterator = impl.streamLines(`${baseUrl}/missing`);

    await expect(iterator.next()).rejects.toThrowError('HTTP 404');
  });
});
