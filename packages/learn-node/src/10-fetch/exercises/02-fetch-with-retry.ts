/**
 * 练习 2：带指数退避的 fetch 重试
 *
 * 场景：网络抖动、下游临时 503 时自动重试，避免调用方手写重试逻辑。
 *
 * 函数签名
 *   fetchWithRetry(url: string, options?: RetryOptions): Promise<Response>
 *   - url：目标地址
 *   - options.retries：最大重试次数，默认 3（总请求数 = retries + 1），>= 0 的整数
 *   - options.baseDelayMs：基础延迟，默认 200，>= 0 的数字
 *   - options.signal：AbortSignal，中止时停止重试
 *   - 返回：最后一次的 Response（无论状态码如何）
 *
 * 示例
 *   fetchWithRetry(`${baseUrl}/flaky`, { retries: 2, baseDelayMs: 1 })
 *   => Response { status: 200 }（前两次 503，第三次 200）
 *
 *   fetchWithRetry(`${baseUrl}/bad-request`, { retries: 3, baseDelayMs: 1 })
 *   => Response { status: 400 }（4xx 不重试，立即返回）
 *
 *   fetchWithRetry(`${baseUrl}/always-500`, { retries: 2, baseDelayMs: 1 })
 *   => Response { status: 500 }（重试用尽后返回最后一次响应）
 *
 * 要求
 *   1. 只重试网络错误与 408/425/429/500/502/503/504；4xx（上述除外）立即返回；
 *   2. 最多重试 retries 次，总请求数 = retries + 1；
 *   3. 延迟为 baseDelayMs * 2^attempt，使用 timers/promises 的 setTimeout，支持 signal；
 *   4. 最后一轮即使状态码仍可重试，也直接返回该 Response（网络错误仍然抛出）；
 *   5. signal 中止时停止重试，抛出 AbortError；
 *   6. retries 不是 >= 0 的整数或 baseDelayMs 不是 >= 0 的数字时抛 RangeError。
 *
 * 提示：只有幂等请求才能安全重试；POST 需要幂等键或业务确认。
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
