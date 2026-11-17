/**
 * 练习 1：封装 fetch JSON 客户端。
 *
 * 要求：
 * - body 存在时默认 POST，自动 JSON.stringify 并设置 content-type；
 * - timeoutMs 使用 AbortSignal.timeout，超时错误包含毫秒数；
 * - 非 2xx 抛出 HttpResponseError（携带 status 与响应文本）；
 * - 空响应体返回 undefined；
 * - 响应不是合法 JSON 时抛出带 cause 的错误。
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
