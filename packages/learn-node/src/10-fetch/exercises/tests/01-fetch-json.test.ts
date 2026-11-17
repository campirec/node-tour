import { once } from 'node:events';
import { createServer, type Server } from 'node:http';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { loadImpl } from '../../../shared/load-impl.js';

const impl = await loadImpl({
  exercise: () => import('../01-fetch-json.js'),
  solution: () => import('../solutions/01-fetch-json.js'),
});

describe('fetchJson', () => {
  let server: Server;
  let baseUrl: string;

  beforeAll(async () => {
    server = createServer((request, response) => {
      const url = new URL(request.url ?? '/', 'http://localhost');

      if (url.pathname === '/json') {
        response.writeHead(200, { 'content-type': 'application/json' });
        response.end(JSON.stringify({ ok: true }));
        return;
      }
      if (url.pathname === '/echo') {
        const chunks: Buffer[] = [];
        request.on('data', (chunk: Buffer) => chunks.push(chunk));
        request.on('end', () => {
          response.writeHead(200, { 'content-type': 'application/json' });
          response.end(
            JSON.stringify({
              method: request.method,
              contentType: request.headers['content-type'],
              body: JSON.parse(Buffer.concat(chunks).toString('utf8')),
            }),
          );
        });
        return;
      }
      if (url.pathname === '/empty') {
        response.writeHead(204);
        response.end();
        return;
      }
      if (url.pathname === '/bad-json') {
        response.writeHead(200, { 'content-type': 'text/plain' });
        response.end('not json');
        return;
      }
      if (url.pathname === '/slow') {
        setTimeout(() => {
          response.writeHead(200, { 'content-type': 'application/json' });
          response.end('{"slow":true}');
        }, 300);
        return;
      }

      response.writeHead(404, { 'content-type': 'application/json' });
      response.end('{"error":"not found"}');
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

  it('GET 并解析 JSON', async () => {
    await expect(impl.fetchJson(`${baseUrl}/json`)).resolves.toEqual({
      ok: true,
    });
  });

  it('POST 自动序列化并设置 content-type', async () => {
    const result = await impl.fetchJson<{
      method: string;
      contentType: string;
      body: { hello: string };
    }>(`${baseUrl}/echo`, { body: { hello: '世界' } });

    expect(result).toEqual({
      method: 'POST',
      contentType: 'application/json',
      body: { hello: '世界' },
    });
  });

  it('非 2xx 抛出 HttpResponseError', async () => {
    await expect(impl.fetchJson(`${baseUrl}/missing`)).rejects.toMatchObject({
      name: 'HttpResponseError',
      status: 404,
      bodyText: '{"error":"not found"}',
    });
  });

  it('空响应体返回 undefined', async () => {
    await expect(impl.fetchJson(`${baseUrl}/empty`)).resolves.toBeUndefined();
  });

  it('响应非法 JSON 时拒绝', async () => {
    await expect(impl.fetchJson(`${baseUrl}/bad-json`)).rejects.toThrowError(
      '响应不是合法 JSON',
    );
  });

  it('超时后拒绝', async () => {
    await expect(
      impl.fetchJson(`${baseUrl}/slow`, { timeoutMs: 30 }),
    ).rejects.toThrowError('请求超时（30ms）');
  });
});
