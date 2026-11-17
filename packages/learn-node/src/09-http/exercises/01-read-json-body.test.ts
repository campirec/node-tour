import { createServer, type Server } from 'node:http';
import { once } from 'node:events';
import { describe, expect, it } from 'vitest';
import { loadImpl } from '../../shared/load-impl.js';

const impl = await loadImpl({
  exercise: () => import('./01-read-json-body.js'),
  solution: () => import('./solutions/01-read-json-body.js'),
});

async function withServer<T>(
  server: Server,
  fn: (baseUrl: string) => Promise<T>,
): Promise<T> {
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const address = server.address();
  if (!address || typeof address === 'string') {
    throw new Error('服务器启动失败');
  }

  try {
    return await fn(`http://127.0.0.1:${address.port}`);
  } finally {
    const closed = once(server, 'close');
    server.close();
    server.closeAllConnections();
    await closed;
  }
}

function jsonServer(): Server {
  return createServer(async (request, response) => {
    try {
      const body = await impl.readJsonBody(request, 32);
      response.writeHead(200, { 'content-type': 'application/json' });
      response.end(JSON.stringify(body));
    } catch (error) {
      request.resume();
      const status =
        error instanceof impl.PayloadTooLargeError ? 413 : 400;
      response.writeHead(status, { 'content-type': 'application/json' });
      response.end(
        JSON.stringify({
          error: error instanceof Error ? error.message : String(error),
        }),
      );
    }
  });
}

describe('readJsonBody', () => {
  it('解析合法 JSON', async () => {
    await withServer(jsonServer(), async (baseUrl) => {
      const response = await fetch(`${baseUrl}/echo`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ok: true }),
      });

      expect(response.status).toBe(200);
      await expect(response.json()).resolves.toEqual({ ok: true });
    });
  });

  it('拒绝非法 JSON 与空请求体', async () => {
    await withServer(jsonServer(), async (baseUrl) => {
      const invalid = await fetch(`${baseUrl}/echo`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: '{broken',
      });
      expect(invalid.status).toBe(400);
      const invalidBody = (await invalid.json()) as { error: string };
      expect(invalidBody.error).toContain('不是合法 JSON');

      const empty = await fetch(`${baseUrl}/echo`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: '',
      });
      expect(empty.status).toBe(400);
      const emptyBody = (await empty.json()) as { error: string };
      expect(emptyBody.error).toContain('请求体为空');
    });
  });

  it('根据 content-length 提前拒绝超大请求体', async () => {
    await withServer(jsonServer(), async (baseUrl) => {
      const response = await fetch(`${baseUrl}/echo`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ data: 'x'.repeat(100) }),
      });

      expect(response.status).toBe(413);
      const body = (await response.json()) as { error: string };
      expect(body.error).toContain('超过 32 字节上限');
    });
  });
});
