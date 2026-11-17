/**
 * 练习 2：带指数退避的 fetch 重试。
 *
 * 要求：
 * - 只重试网络错误与 408/425/429/500/502/503/504；
 * - 4xx（除上述）立即返回，不浪费时间；
 * - 最多重试 retries 次（总请求数 = retries + 1）；
 * - 延迟为 baseDelayMs * 2^attempt，使用 timers/promises 并支持 signal；
 * - 最后一轮无论状态如何都返回 Response，交给调用方判断；
 * - retries/baseDelayMs 非法时抛出 RangeError。
 *
 * 生产注意：只有幂等请求才能安全重试；POST 需要幂等键或业务确认。
 */
export interface RetryOptions {
  retries?: number;
  baseDelayMs?: number;
  signal?: AbortSignal;
}

const RETRYABLE_STATUS = new Set([408, 425, 429, 500, 502, 503, 504]);

export async function fetchWithRetry(
  url: string,
  options: RetryOptions = {},
): Promise<Response> {
  // TODO
  throw new Error('TODO: fetchWithRetry');
}
