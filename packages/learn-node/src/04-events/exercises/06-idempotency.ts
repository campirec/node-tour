/**
 * 企业级练习：幂等键防重复提交
 *
 * 场景：支付、下单、发送通知等操作，客户端因网络重试或用户双击而重复请求。
 * 通过 Idempotency-Key 让同一业务请求只执行一次，后续命中缓存直接返回。
 *
 * 函数签名
 *   createIdempotentExecutor(options?: IdempotencyOptions): IdempotentExecutor
 *   - options.ttlMs：缓存存活时间，默认 300000（5 分钟），必须是正数
 *   - options.maxEntries：最大缓存条目数，默认 10000，必须是正整数
 *   - options.now：时间函数，默认 Date.now，用于测试注入
 *
 *   IdempotentExecutor.run<T>(key: string, fn: () => Promise<T>): Promise<T>
 *   - key：幂等键，不能为空
 *   - fn：首次执行的业务函数
 *
 *   IdempotentExecutor.size(): number
 *
 * 示例
 *   const exec = createIdempotentExecutor()
 *   let calls = 0
 *   const fn = async () => { calls++; return { ok: true } }
 *   await exec.run('order-1', fn)  // calls=1, 返回 { ok: true }
 *   await exec.run('order-1', fn)  // calls 仍=1, 返回缓存的 { ok: true }
 *
 *   // 并发：相同 key 第二个请求
 *   exec.run('key', async () => { await sleep(50); return 'done' })
 *   exec.run('key', async () => 'other')
 *   => 第二个抛 IdempotencyConflictError
 *
 * 要求
 *   1. 首次收到 key 时执行 fn，缓存结果；相同 key 的后续请求直接返回缓存，不重复执行 fn；
 *   2. 不同 key 独立执行；
 *   3. fn 执行失败不缓存（删除 pending 条目），允许重试；
 *   4. 同一 key 正在执行（pending）时，第二个请求抛 IdempotencyConflictError；
 *   5. TTL 到期后清除缓存，允许重新执行（默认 5 分钟）；
 *   6. maxEntries 限制内存占用，超限时淘汰最旧条目（FIFO）；
 *   7. now 可注入用于测试；ttlMs 必须是正数、maxEntries 必须是正整数，否则抛 RangeError；
 *   8. key 不能为空，否则抛 RangeError。
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
