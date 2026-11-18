/**
 * 练习 1：封装 fetch JSON 客户端
 *
 * 场景：前端/服务端统一 JSON 请求封装，自动处理超时、序列化与非 2xx 错误。
 *
 * 函数签名
 *   fetchJson<T>(url: string, options?: FetchJsonOptions): Promise<T>
 *   - url：目标地址
 *   - options.method：HTTP 方法；省略时有 body 默认 POST，无 body 默认 GET
 *   - options.body：请求体对象，自动 JSON.stringify 并设置 content-type: application/json
 *   - options.headers：自定义请求头
 *   - options.timeoutMs：超时毫秒数，使用 AbortSignal.timeout
 *   - 返回：解析后的 JSON；空响应体返回 undefined
 *
 * 示例
 *   fetchJson(`${baseUrl}/json`)
 *   => { ok: true }
 *
 *   fetchJson(`${baseUrl}/echo`, { body: { hello: '世界' } })
 *   => { method: 'POST', contentType: 'application/json', body: { hello: '世界' } }
 *
 *   fetchJson(`${baseUrl}/missing`)
 *   => 抛 HttpResponseError（status: 404, bodyText: '{"error":"not found"}'）
 *
 * 要求
 *   1. body 存在时默认 POST，自动 JSON.stringify 并设置 content-type: application/json；
 *   2. timeoutMs 超时后抛 Error('请求超时（${timeoutMs}ms）')，保留 cause；
 *   3. 非 2xx 抛 HttpResponseError，携带 status 与 bodyText（完整响应文本）；
 *   4. 空响应体（text.trim() 为空）返回 undefined；
 *   5. 响应不是合法 JSON 时抛 Error('响应不是合法 JSON')，保留 cause。
 */
export class HttpResponseError extends Error {
  readonly status: number;
  readonly bodyText: string;

  constructor(status: number, bodyText: string) {
    super(`HTTP ${status}: ${bodyText.slice(0, 200)}`);
    this.name = 'HttpResponseError';
    this.status = status;
    this.bodyText = bodyText;
  }
}

export interface FetchJsonOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  timeoutMs?: number;
}

export async function fetchJson<T = unknown>(
  url: string,
  options: FetchJsonOptions = {},
): Promise<T> {
  // TODO: fetch + response.ok + JSON.parse
  throw new Error('TODO: fetchJson');
}
