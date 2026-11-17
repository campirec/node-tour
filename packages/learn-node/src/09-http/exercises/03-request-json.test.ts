import { once } from 'node:events';
import { createServer, type Server } from 'node:http';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { loadImpl } from '../../shared/load-impl.js';

const impl = await loadImpl({
  exercise: () => import('./03-request-json.js'),
  solution: () => import('./solutions/03-request-json.js'),
});

describe('requestJson', () => {
  let server: Server;
  let baseUrl: string;

  beforeAll(async () => {
    server = createServer((request, response) => {
      const url = new URL(request.url ?? '/', 'http://localhost');

      if (url.pathname === '/json') {
        response.writeHead(200, { 'content-type': 'application/json' });
        response.end(JSON.stringify({ method: request.method, ok: true }));
        return;
      }

      if (url.pathname === '/echo') {
        const chunks: Buffer[] = [];
        request.on('data', (chunk: Buffer) => chunks.push(chunk));
        request.on('end', () => {
          response.writeHead(201, { 'content-type': 'application/json' });
          response.end(
            JSON.stringify({
              body: JSON.parse(Buffer.concat(chunks).toString('utf8')),
              contentType: request.headers['content-type'],
            }),
          );
        });
        return;
      }

      if (url.pathname === '/bad-json') {
        response.writeHead(200, { 'content-type': 'application/json' });
        response.end('not json');
        return;
      }

      if (url.pathname === '/slow') {
        setTimeout(() => {
          response.writeHead(200, { 'content-type': 'application/json' });
          response.end('{"slow":true}');
        }, 200);
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

  it('GET 返回状态、响应头与 JSON body', async () => {
    const result = await impl.requestJson<{ method: string; ok: boolean }>(
      `${baseUrl}/json`,
    );

    expect(result.status).toBe(200);
    expect(result.headers['content-type']).toBe('application/json');
    expect(result.body).toEqual({ method: 'GET', ok: true });
  });

  it('POST 自动序列化 JSON 并设置 content-type', async () => {
    const result = await impl.requestJson<{
      body: { hello: string };
      contentType: string;
    }>(`${baseUrl}/echo`, {
      body: { hello: '世界' },
    });

    expect(result.status).toBe(201);
    expect(result.body).toEqual({
      body: { hello: '世界' },
      contentType: 'application/json',
    });
  });

  it('非 2xx 仍返回给调用方处理', async () => {
    const result = await impl.requestJson<{ error: string }>(
      `${baseUrl}/missing`,
    );

    expect(result.status).toBe(404);
    expect(result.body).toEqual({ error: 'not found' });
  });

  it('响应不是 JSON 时拒绝', async () => {
    await expect(
      impl.requestJson(`${baseUrl}/bad-json`),
    ).rejects.toThrowError('响应不是合法 JSON');
  });

  it('超时销毁请求并拒绝', async () => {
    await expect(
      impl.requestJson(`${baseUrl}/slow`, { timeoutMs: 30 }),
    ).rejects.toThrowError('请求超时（30ms）');
  });
});
