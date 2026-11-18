import type { IncomingHttpHeaders } from 'node:http';

/**
 * 练习 3：用 node:http 实现 JSON 客户端
 *
 * 场景：服务间调用、健康检查、或在不支持 fetch 的环境中发 HTTP 请求。
 *
 * 函数签名
 *   requestJson<T>(url: string, options?: RequestJsonOptions): Promise<JsonClientResult<T>>
 *   - url：目标地址
 *   - options.method：HTTP 方法；省略时有 body 默认 POST，无 body 默认 GET
 *   - options.body：请求体对象，自动 JSON.stringify 并设置 content-type/content-length
 *   - options.headers：自定义请求头
 *   - options.timeoutMs：超时毫秒数，到期后销毁请求并拒绝
 *   - 返回：{ status, headers, body }，非 2xx 不自动抛错
 *
 * 示例
 *   requestJson(`${baseUrl}/json`)
 *   => { status: 200, headers: {...}, body: { method: 'GET', ok: true } }
 *
 *   requestJson(`${baseUrl}/echo`, { body: { hello: '世界' } })
 *   => { status: 201, headers: {...}, body: { body: { hello: '世界' }, contentType: 'application/json' } }
 *
 *   requestJson(`${baseUrl}/slow`, { timeoutMs: 30 })
 *   => 抛 Error('请求超时（30ms）')
 *
 * 要求
 *   1. 有 body 时自动设置 content-type: application/json 与 content-length；
 *   2. 非 2xx 状态码不抛错，正常返回结果交给调用方判断；
 *   3. 空响应体（text.trim() 为空）时 body 为 undefined；
 *   4. 响应不是合法 JSON 时抛 Error('响应不是合法 JSON')，保留 cause；
 *   5. timeoutMs 到期后销毁请求并抛 Error('请求超时（${timeoutMs}ms）')。
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
