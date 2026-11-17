/**
 * 企业级练习：幂等键防重复提交。
 *
 * 场景：支付、下单、发送通知等操作，客户端因网络重试或用户双击而重复请求。
 * 通过 Idempotency-Key 让同一业务请求只执行一次。
 *
 * 要求：
 * - 首次收到 key 时执行 fn，缓存结果；
 * - 相同 key 的后续请求直接返回缓存结果，不重复执行 fn；
 * - 不同 key 独立执行；
 * - 执行失败不缓存，允许重试；
 * - TTL 到期后清除缓存（默认 5 分钟）；
 * - now 可注入，便于测试；
 * - maxEntries 限制内存占用，超限淘汰最旧条目。
 */
export class IdempotencyConflictError extends Error {
  constructor(key: string) {
    super(`幂等键 ${key} 对应的请求正在处理中`);
    this.name = 'IdempotencyConflictError';
  }
}

export interface IdempotencyOptions {
  ttlMs?: number;
  maxEntries?: number;
  now?: () => number;
}

export interface IdempotentExecutor {
  run<T>(key: string, fn: () => Promise<T>): Promise<T>;
  size(): number;
}

export function createIdempotentExecutor(
  options: IdempotencyOptions = {},
): IdempotentExecutor {
  // TODO
  throw new Error('TODO: createIdempotentExecutor');
}
