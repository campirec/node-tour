/**
 * 企业级练习：固定窗口限流器
 *
 * 场景：登录接口、短信验证码、第三方 API 配额、按订阅计划限流，
 * 每个 key（IP / userId / apiKey）在时间窗口内只允许 N 次请求。
 *
 * 函数签名
 *   createFixedWindowRateLimiter(options): FixedWindowRateLimiter
 *   - options.limit：窗口内允许的最大请求数，正整数
 *   - options.windowMs：窗口时长（毫秒），正数
 *   - options.now：时间注入函数，默认 Date.now，便于测试
 *   - options.maxKeys：最大 key 数量，默认 10_000，正整数，超限时淘汰最早插入的 key
 *   - 返回：{ check(key), size() }
 *     check 返回 { allowed, remaining, retryAfterMs, resetAt }
 *
 * 示例（now() = 1000, limit = 2, windowMs = 1000）
 *   limiter.check('ip-1') => { allowed: true, remaining: 1, retryAfterMs: 0, resetAt: 2000 }
 *   limiter.check('ip-1') => { allowed: true, remaining: 0, retryAfterMs: 0, resetAt: 2000 }
 *   limiter.check('ip-1') => { allowed: false, remaining: 0, retryAfterMs: 1000, resetAt: 2000 }
 *
 *   limiter.check('a'); limiter.check('b'); limiter.check('c')  // maxKeys = 2
 *   limiter.size() <= 2
 *
 * 要求
 *   1. 每个 key 独立计数，窗口内未达 limit 时 allowed = true，remaining 递减；
 *   2. 达到 limit 后 allowed = false，retryAfterMs = resetAt - now，resetAt = windowStart + windowMs；
 *   3. 窗口过期（now - windowStart >= windowMs）后计数重置为 0；
 *   4. 不同 key 互不影响；
 *   5. maxKeys 超限时淘汰最早插入的非当前 key，size() 不超过 maxKeys；
 *   6. limit / maxKeys 不是正整数时抛 RangeError；windowMs 非正数时抛 RangeError；
 *   7. key 为空串时抛 RangeError。
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
