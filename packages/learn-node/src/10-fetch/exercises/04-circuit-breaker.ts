/**
 * 企业级练习：熔断器
 *
 * 场景：下游服务持续超时/500 时，继续重试只会放大故障。熔断器在连续
 * 失败后快速失败（open），冷却后放一个探测请求（half-open），成功则
 * 恢复（closed），失败则重新熔断。
 *
 * 函数签名
 *   createCircuitBreaker(options?: CircuitBreakerOptions): CircuitBreaker
 *   - options.failureThreshold：连续失败阈值，默认 5，正整数
 *   - options.cooldownMs：冷却时长，默认 30_000，正数
 *   - options.now：时间注入函数，默认 Date.now，便于测试
 *   - 返回：{ execute(action), state(), reset() }
 *
 * 示例（failureThreshold = 2, cooldownMs = 1000）
 *   breaker.execute(async () => { throw new Error('down') })  // 第 1 次失败
 *   => 抛 Error('down')
 *   breaker.execute(async () => { throw new Error('down') })  // 第 2 次失败
 *   => 抛 Error('down')，state() 变为 'open'
 *   breaker.execute(async () => 'never')
 *   => 抛 CircuitOpenError（不再调用 action）
 *
 * 要求
 *   1. 连续失败达到 failureThreshold 时进入 open 状态；
 *   2. open 期间（未过 cooldownMs）直接抛 CircuitOpenError，不调用 action；
 *   3. cooldownMs 过后允许一个探测请求（half-open）：成功则恢复 closed，失败则重新 open；
 *   4. 成功会清零连续失败计数；
 *   5. action 抛出的异常原样向上传播（不吞错）；
 *   6. reset() 立即将状态重置为 closed 并清零计数；
 *   7. failureThreshold 不是正整数或 cooldownMs 非正数时抛 RangeError。
 */
export class CircuitOpenError extends Error {
  readonly retryAfterMs: number;

  constructor(retryAfterMs: number) {
    super(`熔断器已打开，请在 ${retryAfterMs}ms 后重试`);
    this.name = 'CircuitOpenError';
    this.retryAfterMs = retryAfterMs;
  }
}

export type CircuitState = 'closed' | 'open' | 'half-open';

export interface CircuitBreakerOptions {
  failureThreshold?: number;
  cooldownMs?: number;
  now?: () => number;
}

export interface CircuitBreaker {
  execute<T>(action: () => Promise<T>): Promise<T>;
  state(): CircuitState;
  reset(): void;
}

export function createCircuitBreaker(
  options: CircuitBreakerOptions = {},
): CircuitBreaker {
  // TODO
  throw new Error('TODO: createCircuitBreaker');
}
