import { createServer, type IncomingHttpHeaders, type Server } from 'node:http';

/**
 * 练习 2：实现一个最小 JSON HTTP 服务器。
 *
 * 要求：
 * - 把请求解析为 { method, url, headers, body } 交给 handler；
 * - 只对 POST/PUT/PATCH 读取 JSON 请求体，上限 1 MiB；
 * - handler 返回 { status?, headers?, body? }，默认 200；
 * - 响应头默认 content-type: application/json; charset=utf-8；
 * - 请求体非法 JSON 返回 400，handler 抛错返回 500，不泄漏内部错误；
 * - 204 响应不发送 body。
 *
 * 说明：生产项目用 Fastify/Nest，但理解这一层能帮助排查中间件顺序、
 * body 解析、错误处理与 keep-alive 问题。
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
