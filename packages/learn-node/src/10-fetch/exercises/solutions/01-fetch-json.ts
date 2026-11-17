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
  const hasBody = options.body !== undefined;
  const signal =
    options.timeoutMs === undefined
      ? undefined
      : AbortSignal.timeout(options.timeoutMs);

  const headers: Record<string, string> = {
    ...(hasBody ? { 'content-type': 'application/json' } : {}),
    ...(options.headers ?? {}),
  };

  let response: Response;
  try {
    response = await fetch(url, {
      method: options.method ?? (hasBody ? 'POST' : 'GET'),
      headers,
      ...(hasBody ? { body: JSON.stringify(options.body) } : {}),
      ...(signal ? { signal } : {}),
    });
  } catch (error) {
    if (signal?.aborted) {
      throw new Error(`请求超时（${options.timeoutMs}ms）`, { cause: error });
    }
    throw error;
  }

  const text = await response.text();
  if (!response.ok) {
    throw new HttpResponseError(response.status, text);
  }
  if (text.trim() === '') {
    return undefined as T;
  }

  try {
    return JSON.parse(text) as T;
  } catch (error) {
    throw new Error('响应不是合法 JSON', { cause: error });
  }
}
