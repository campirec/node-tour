import type { IncomingHttpHeaders } from 'node:http';

/**
 * 练习 3：用 node:http 实现 JSON 客户端。
 *
 * 场景：服务间调用、健康检查、访问不支持 fetch 的环境。
 *
 * 要求：
 * - method 默认：有 body 时 POST，否则 GET；
 * - body 自动 JSON.stringify，并设置 content-type/content-length；
 * - 返回 { status, headers, body }，非 2xx 不自动抛错；
 * - 空响应体返回 undefined；
 * - 响应不是合法 JSON 时拒绝；
 * - timeoutMs 到期后销毁请求并拒绝，错误包含毫秒数。
 */
export interface JsonClientResult<T> {
  status: number;
  headers: IncomingHttpHeaders;
  body: T;
}

export interface RequestJsonOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  timeoutMs?: number;
}

export function requestJson<T = unknown>(
  url: string,
  options: RequestJsonOptions = {},
): Promise<JsonClientResult<T>> {
  // TODO: http.request + 收集响应 + JSON.parse
  throw new Error('TODO: requestJson');
}
