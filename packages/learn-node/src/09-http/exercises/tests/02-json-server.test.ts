import { once } from 'node:events';
import type { Server } from 'node:http';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { loadImpl } from '../../../shared/load-impl.js';

const impl = await loadImpl({
  exercise: () => import('../02-json-server.js'),
  solution: () => import('../solutions/02-json-server.js'),
});

describe('createJsonServer', () => {
  let server: Server;
  let baseUrl: string;

  beforeEach(async () => {
    server = impl.createJsonServer((request) => {
      if (request.method === 'GET' && request.url.pathname === '/health') {
        return { body: { status: 'ok' } };
      }
      if (request.method === 'POST' && request.url.pathname === '/echo') {
        return {
          status: 201,
          headers: { 'x-echo': request.url.searchParams.get('tag') ?? '' },
          body: request.body,
        };
      }
      if (request.url.pathname === '/boom') {
        throw new Error('数据库连接串 password=123456');
      }
      return { status: 404, body: { error: 'not found' } };
    });

    server.listen(0, '127.0.0.1');
    await once(server, 'listening');
    const address = server.address();
    if (!address || typeof address === 'string') {
      throw new Error('服务器启动失败');
    }
    baseUrl = `http://127.0.0.1:${address.port}`;
  });

  afterEach(async () => {
    if (!server) {
      return;
    }
    const closed = once(server, 'close');
    server.close();
    server.closeAllConnections();
    await closed;
  });

  it('处理 GET 并返回 JSON 与默认 content-type', async () => {
    const response = await fetch(`${baseUrl}/health`);

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe(
      'application/json; charset=utf-8',
    );
    await expect(response.json()).resolves.toEqual({ status: 'ok' });
  });

  it('解析 POST JSON body 并应用自定义状态/响应头', async () => {
    const response = await fetch(`${baseUrl}/echo?tag=test`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ hello: '世界' }),
    });

    expect(response.status).toBe(201);
    expect(response.headers.get('x-echo')).toBe('test');
    await expect(response.json()).resolves.toEqual({ hello: '世界' });
  });

  it('未知路由交给 handler 决定', async () => {
    const response = await fetch(`${baseUrl}/missing`);

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({ error: 'not found' });
  });

  it('非法 JSON 返回 400', async () => {
    const response = await fetch(`${baseUrl}/echo`, {
      method: 'POST',
      body: '{bad',
    });

    expect(response.status).toBe(400);
  });

  it('handler 异常返回 500 且不泄漏内部信息', async () => {
    const response = await fetch(`${baseUrl}/boom`);
    const text = await response.text();

    expect(response.status).toBe(500);
    expect(text).not.toContain('123456');
    expect(text).not.toContain('数据库');
  });
});
