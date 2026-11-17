/**
 * 企业级练习：熔断器。
 *
 * 场景：下游服务持续超时/500 时，继续重试只会放大故障。
 * 熔断器在连续失败后快速失败（open），冷却后放一个探测请求（half-open），
 * 成功则恢复（closed），失败则继续熔断。
 *
 * 要求：
 * - 连续失败达到 failureThreshold 进入 open；
 * - open 期间直接抛 CircuitOpenError，不再调用 action；
 * - cooldownMs 后允许一个探测请求；成功关闭，失败重新 open；
 * - 成功会清零连续失败计数；
 * - now 可注入，便于测试；
 * - failureThreshold 必须是正整数，cooldownMs 必须是正数。
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
