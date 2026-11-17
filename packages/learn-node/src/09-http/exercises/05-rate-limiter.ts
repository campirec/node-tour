/**
 * 企业级练习：固定窗口限流器。
 *
 * 场景：登录接口、短信验证码、第三方 API 配额、按订阅计划限流。
 *
 * 要求：
 * - 每个 key 独立计数（key 可以是 IP、userId、apiKey、route+IP）；
 * - 窗口内达到 limit 后拒绝，返回 retryAfterMs 与 resetAt；
 * - 窗口过期后计数重置；
 * - now 可注入，便于测试，不依赖真实时间；
 * - maxKeys 限制内存占用，超限时淘汰最早插入的 key；
 * - 参数非法时抛 RangeError。
 */
export interface RateLimitOptions {
  limit: number;
  windowMs: number;
  now?: () => number;
  maxKeys?: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterMs: number;
  resetAt: number;
}

export interface FixedWindowRateLimiter {
  check(key: string): RateLimitResult;
  size(): number;
}

export function createFixedWindowRateLimiter(
  options: RateLimitOptions,
): FixedWindowRateLimiter {
  // TODO
  throw new Error('TODO: createFixedWindowRateLimiter');
}
