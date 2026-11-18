import { setTimeout as sleep } from 'node:timers/promises';

/**
 * 企业级练习：通用异步重试工具
 *
 * 场景：调用下游 HTTP、消息队列、对象存储时的瞬时失败。需要指数退避 +
 * 可选 jitter + 可选中止，使重试行为可控且避免重试风暴。
 *
 * 函数签名
 *   withRetry<T>(fn: (attempt: number) => Promise<T> | T, options?: RetryOptions): Promise<T>
 *   - fn：每次尝试调用的函数，接收 1-based attempt 序号
 *   - options.retries：最大重试次数，默认 3（总共最多执行 retries+1 次）
 *   - options.baseDelayMs：基础延迟毫秒，默认 100
 *   - options.maxDelayMs：延迟上限毫秒，默认 30000
 *   - options.jitter：是否随机抖动，默认 false
 *   - options.signal：AbortSignal，中止后不再重试
 *   - options.shouldRetry：自定义判断函数，返回 false 时立即停止
 *   - 返回：fn 成功时的返回值
 *
 * 示例
 *   withRetry(async (attempt) => {
 *     if (attempt < 3) throw new Error(`fail-${attempt}`);
 *     return 'ok';
 *   }, { retries: 3, baseDelayMs: 1 })
 *   => 'ok'（fn 收到 attempt 1, 2, 3）
 *
 *   withRetry(async () => { throw Object.assign(new Error('bad'), { status: 400 }) },
 *   { retries: 5, shouldRetry: (e) => e.status !== 400 })
 *   => 拒绝并抛原错误（shouldRetry 返回 false，只调用 1 次）
 *
 *   withRetry(async () => { throw new Error('attempt-3') }, { retries: 2, baseDelayMs: 1 })
 *   => 拒绝并抛 'attempt-3'（总共 3 次后用尽，抛最后一次错误）
 *
 * 要求
 *   1. 最多执行 retries+1 次，回调收到 1-based attempt；
 *   2. 每次重试前延迟 = min(maxDelayMs, baseDelayMs * 2^(attempt-1))；
 *   3. jitter=true 时延迟在 [0, 计算延迟] 内随机；
 *   4. shouldRetry 返回 false 时立即停止，抛出当前错误；
 *   5. 支持 AbortSignal，中止后抛 signal.reason（name 为 AbortError），不再重试；
 *   6. 全部重试用尽后抛出最后一次错误；
 *   7. 参数非法（retries < 0 或非整数、baseDelayMs < 0 或非有限数、
 *      maxDelayMs < 0 或非有限数）抛 RangeError。
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
