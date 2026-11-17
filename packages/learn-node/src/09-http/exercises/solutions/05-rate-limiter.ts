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

interface WindowEntry {
  count: number;
  windowStart: number;
}

export function createFixedWindowRateLimiter(
  options: RateLimitOptions,
): FixedWindowRateLimiter {
  const { limit, windowMs } = options;
  const now = options.now ?? Date.now;
  const maxKeys = options.maxKeys ?? 10_000;

  if (!Number.isInteger(limit) || limit < 1) {
    throw new RangeError('limit 必须是正整数');
  }
  if (!Number.isFinite(windowMs) || windowMs <= 0) {
    throw new RangeError('windowMs 必须是正数');
  }
  if (!Number.isInteger(maxKeys) || maxKeys < 1) {
    throw new RangeError('maxKeys 必须是正整数');
  }

  const windows = new Map<string, WindowEntry>();

  return {
    check(key: string): RateLimitResult {
      if (!key) {
        throw new RangeError('key 不能为空');
      }

      const current = now();
      let entry = windows.get(key);

      if (!entry || current - entry.windowStart >= windowMs) {
        entry = { count: 0, windowStart: current };
        windows.set(key, entry);
      }

      if (windows.size > maxKeys) {
        for (const existing of windows.keys()) {
          if (existing !== key) {
            windows.delete(existing);
            break;
          }
        }
      }

      const resetAt = entry.windowStart + windowMs;
      if (entry.count >= limit) {
        return {
          allowed: false,
          remaining: 0,
          retryAfterMs: Math.max(0, resetAt - current),
          resetAt,
        };
      }

      entry.count += 1;
      return {
        allowed: true,
        remaining: limit - entry.count,
        retryAfterMs: 0,
        resetAt,
      };
    },

    size(): number {
      return windows.size;
    },
  };
}
