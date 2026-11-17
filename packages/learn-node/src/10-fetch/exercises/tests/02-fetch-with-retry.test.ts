import { once } from 'node:events';
import { createServer, type Server } from 'node:http';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { loadImpl } from '../../../shared/load-impl.js';

const impl = await loadImpl({
  exercise: () => import('../02-fetch-with-retry.js'),
  solution: () => import('../solutions/02-fetch-with-retry.js'),
});

describe('fetchWithRetry', () => {
  let server: Server;
  let baseUrl: string;
  const hits = new Map<string, number>();

  beforeAll(async () => {
    server = createServer((request, response) => {
      const path = new URL(request.url ?? '/', 'http://localhost').pathname;
      const count = (hits.get(path) ?? 0) + 1;
      hits.set(path, count);

      if (path === '/flaky') {
        response.writeHead(count < 3 ? 503 : 200, {
          'content-type': 'application/json',
        });
        response.end(JSON.stringify({ attempts: count }));
        return;
      }
      if (path === '/bad-request') {
        response.writeHead(400, { 'content-type': 'application/json' });
        response.end('{"error":"bad"}');
        return;
      }
      if (path === '/always-500') {
        response.writeHead(500);
        response.end('server error');
        return;
      }
      if (path === '/slow') {
        setTimeout(() => {
          response.writeHead(200);
          response.end('ok');
        }, 500);
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

  it('遇到 503 指数退避后成功', async () => {
    hits.clear();
    const response = await impl.fetchWithRetry(`${baseUrl}/flaky`, {
      retries: 2,
      baseDelayMs: 1,
    });

    expect(response.status).toBe(200);
    expect(hits.get('/flaky')).toBe(3);
  });

  it('4xx 不重试', async () => {
    hits.clear();
    const response = await impl.fetchWithRetry(`${baseUrl}/bad-request`, {
      retries: 3,
      baseDelayMs: 1,
    });

    expect(response.status).toBe(400);
    expect(hits.get('/bad-request')).toBe(1);
  });

  it('用尽重试后返回最后一次响应', async () => {
    hits.clear();
    const response = await impl.fetchWithRetry(`${baseUrl}/always-500`, {
      retries: 2,
      baseDelayMs: 1,
    });

    expect(response.status).toBe(500);
    expect(hits.get('/always-500')).toBe(3);
  });

  it('signal 中止时停止重试', async () => {
    hits.clear();
    const controller = new AbortController();
    const promise = impl.fetchWithRetry(`${baseUrl}/slow`, {
      retries: 3,
      baseDelayMs: 1,
      signal: controller.signal,
    });
    setTimeout(() => controller.abort(), 20);

    await expect(promise).rejects.toMatchObject({ name: 'AbortError' });
    expect(hits.get('/slow')).toBe(1);
  });

  it('拒绝非法参数', async () => {
    await expect(
      impl.fetchWithRetry(`${baseUrl}/flaky`, { retries: -1 }),
    ).rejects.toBeInstanceOf(RangeError);
    await expect(
      impl.fetchWithRetry(`${baseUrl}/flaky`, { baseDelayMs: -1 }),
    ).rejects.toBeInstanceOf(RangeError);
  });
});
