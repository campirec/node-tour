import { setTimeout as sleep } from 'node:timers/promises';

/**
 * 企业级练习：通用异步重试工具。
 *
 * 场景：调用下游 HTTP、消息队列、对象存储时的瞬时失败。
 *
 * 要求：
 * - 最多执行 retries+1 次，回调收到 1-based attempt；
 * - 延迟为 min(maxDelayMs, baseDelayMs * 2^(attempt-1))；
 * - jitter=true 时在 [0, delay] 内随机，避免重试风暴；
 * - shouldRetry 返回 false 时立即停止；
 * - 支持 AbortSignal，中止后抛 AbortError，不再重试；
 * - 全部失败时抛出最后一次错误；
 * - 参数非法抛 RangeError。
 *
 * 注意：只对幂等操作自动重试。
 */
export interface RetryOptions {
  retries?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
  jitter?: boolean;
  signal?: AbortSignal;
  shouldRetry?: (error: unknown, attempt: number) => boolean;
}

export async function withRetry<T>(
  fn: (attempt: number) => Promise<T> | T,
  options: RetryOptions = {},
): Promise<T> {
  // TODO
  throw new Error('TODO: withRetry');
}
