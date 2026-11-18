import { setTimeout as sleep } from 'node:timers/promises';

/**
 * 企业级练习：通用超时包装
 *
 * 场景：数据库查询、外部 API 调用、锁等待、消息消费。任何异步操作都可能
 * 无限挂起，需要包装一层超时保护，超时后以 TimeoutError 拒绝。
 *
 * 函数签名
 *   withTimeout<T>(promise: Promise<T>, options: TimeoutOptions): Promise<T>
 *   - promise：被包装的任意 Promise
 *   - options.timeoutMs：超时毫秒数，必须是正数
 *   - options.signal：可选 AbortSignal，中止时以 AbortError 拒绝
 *   - 返回：promise 正常完成时返回其结果；超时或中止时 reject
 *
 * 示例
 *   withTimeout(Promise.resolve('ok'), { timeoutMs: 100 })
 *   => 'ok'
 *
 *   withTimeout(sleep(200).then(() => 'done'), { timeoutMs: 20 })
 *   => 拒绝，name 为 'TimeoutError'，timeoutMs 为 20
 *
 *   withTimeout(sleep(1000), { timeoutMs: 1000, signal })
 *   signal.abort()  => 拒绝，name 为 'AbortError'
 *
 *   withTimeout(Promise.resolve(), { timeoutMs: 0 })   => 抛 RangeError
 *   withTimeout(Promise.resolve(), { timeoutMs: -1 })  => 抛 RangeError
 *
 * 要求
 *   1. 包装任意 Promise，超时后 reject TimeoutError（含 timeoutMs 字段）；
 *   2. 超时后原 Promise 继续执行，但结果不再被使用；
 *   3. timeoutMs 必须是正数（Number.isFinite && > 0），否则抛 RangeError；
 *   4. 支持 AbortSignal，中止时以 AbortError 拒绝（signal.reason）；
 *   5. 已中止的 signal 传入时立即拒绝；
 *   6. 无论成功、超时还是中止，都清理定时器。
 */
export class TimeoutError extends Error {
  readonly timeoutMs: number;

  constructor(timeoutMs: number) {
    super(`操作超时（${timeoutMs}ms）`);
    this.name = 'TimeoutError';
    this.timeoutMs = timeoutMs;
  }
}

export interface TimeoutOptions {
  timeoutMs: number;
  signal?: AbortSignal;
}

export async function withTimeout<T>(
  promise: Promise<T>,
  options: TimeoutOptions,
): Promise<T> {
  // TODO
  throw new Error('TODO: withTimeout');
}
