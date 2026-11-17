import { describe, expect, it } from 'vitest';
import { loadImpl } from '../../shared/load-impl.js';

const impl = await loadImpl({
  exercise: () => import('./05-rate-limiter.js'),
  solution: () => import('./solutions/05-rate-limiter.js'),
});

function clock(start = 1_000): { now: () => number; advance: (ms: number) => void } {
  let current = start;
  return {
    now: () => current,
    advance: (ms) => {
      current += ms;
    },
  };
}

describe('createFixedWindowRateLimiter', () => {
  it('窗口内允许 limit 次，之后拒绝并给出重试时间', () => {
    const time = clock();
    const limiter = impl.createFixedWindowRateLimiter({
      limit: 2,
      windowMs: 1000,
      now: time.now,
    });

    expect(limiter.check('ip-1')).toMatchObject({
      allowed: true,
      remaining: 1,
      retryAfterMs: 0,
    });
    expect(limiter.check('ip-1')).toMatchObject({
      allowed: true,
      remaining: 0,
    });
    expect(limiter.check('ip-1')).toMatchObject({
      allowed: false,
      remaining: 0,
      retryAfterMs: 1000,
      resetAt: 2000,
    });
  });

  it('窗口过期后重置计数', () => {
    const time = clock();
    const limiter = impl.createFixedWindowRateLimiter({
      limit: 1,
      windowMs: 100,
      now: time.now,
    });

    expect(limiter.check('key').allowed).toBe(true);
    expect(limiter.check('key').allowed).toBe(false);

    time.advance(100);

    expect(limiter.check('key').allowed).toBe(true);
  });

  it('不同 key 互不影响', () => {
    const time = clock();
    const limiter = impl.createFixedWindowRateLimiter({
      limit: 1,
      windowMs: 1000,
      now: time.now,
    });

    expect(limiter.check('a').allowed).toBe(true);
    expect(limiter.check('b').allowed).toBe(true);
    expect(limiter.check('a').allowed).toBe(false);
  });

  it('maxKeys 限制内存占用', () => {
    const limiter = impl.createFixedWindowRateLimiter({
      limit: 1,
      windowMs: 1000,
      maxKeys: 2,
    });

    limiter.check('a');
    limiter.check('b');
    limiter.check('c');

    expect(limiter.size()).toBeLessThanOrEqual(2);
  });

  it('拒绝非法参数', () => {
    expect(() =>
      impl.createFixedWindowRateLimiter({ limit: 0, windowMs: 1000 }),
    ).toThrowError(RangeError);
    expect(() =>
      impl.createFixedWindowRateLimiter({ limit: 1, windowMs: 0 }),
    ).toThrowError(RangeError);
    expect(() =>
      impl.createFixedWindowRateLimiter({
        limit: 1,
        windowMs: 1000,
        maxKeys: 0,
      }),
    ).toThrowError(RangeError);
  });
});
