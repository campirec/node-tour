import { createServer, type IncomingHttpHeaders, type Server } from 'node:http';

/**
 * 练习 2：实现一个最小 JSON HTTP 服务器
 *
 * 场景：需要快速搭建内部微服务或测试桩，理解底层如何解析请求体、
 * 写响应、处理错误，有助于排查中间件顺序与 keep-alive 问题。
 *
 * 函数签名
 *   createJsonServer(handler: JsonHandler): Server
 *   - handler：业务回调，接收 { method, url, headers, body }，返回 JsonResponse
 *   - 返回：node:http Server 实例（未 listen）
 *
 * 示例
 *   createJsonServer((req) => ({ body: { status: 'ok' } }))
 *   GET /health => 200, content-type: application/json; charset=utf-8, body: {"status":"ok"}
 *
 *   createJsonServer((req) => ({ status: 201, headers: { 'x-echo': '1' }, body: req.body }))
 *   POST /echo, body: {"hello":"世界"} => 201, x-echo: 1, body: {"hello":"世界"}
 *
 * 要求
 *   1. 仅对 POST/PUT/PATCH 读取 JSON 请求体（上限 1 MiB），其他方法 body 为 undefined；
 *   2. handler 返回的 JsonResponse 中 status 默认 200，headers 可覆盖默认 content-type；
 *   3. 响应头默认 content-type: application/json; charset=utf-8；
 *   4. 请求体为非法 JSON 时返回 400 + { error: message }；
 *   5. handler 抛错时返回 500 + { error: 'Internal Server Error' }，不泄漏内部信息；
 *   6. status 为 204 时不发送 body。
 */
export interface JsonRequest {
  method: string;
  url: URL;
  headers: IncomingHttpHeaders;
  body: unknown;
}

export interface JsonResponse {
  status?: number;
  headers?: Record<string, string>;
  body?: unknown;
}

export type JsonHandler = (
  request: JsonRequest,
) => JsonResponse | Promise<JsonResponse>;

export function createJsonServer(handler: JsonHandler): Server {
  // TODO: createServer(async (req, res) => ...)
  throw new Error('TODO: createJsonServer');
}
