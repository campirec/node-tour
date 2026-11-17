import { setTimeout as sleep } from 'node:timers/promises';

/**
 * 企业级练习：通用超时包装。
 *
 * 场景：数据库查询、外部 API 调用、锁等待、消息消费。任何异步操作都可能无限挂起。
 *
 * 要求：
 * - 包装任意 Promise，超时后 reject TimeoutError；
 * - 超时后原 Promise 继续执行，但结果不再被使用；
 * - 超时时间必须是正数；
 * - 支持 AbortSignal，中止时以 AbortError 拒绝；
 * - 无论成功、超时还是中止，都清理定时器与监听器。
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
