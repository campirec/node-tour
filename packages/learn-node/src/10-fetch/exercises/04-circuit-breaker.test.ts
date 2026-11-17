import { describe, expect, it } from 'vitest';
import { loadImpl } from '../../shared/load-impl.js';

const impl = await loadImpl({
  exercise: () => import('./04-circuit-breaker.js'),
  solution: () => import('./solutions/04-circuit-breaker.js'),
});

function clock(): { now: () => number; advance: (ms: number) => void } {
  let current = 0;
  return {
    now: () => current,
    advance: (ms) => {
      current += ms;
    },
  };
}

describe('createCircuitBreaker', () => {
  it('失败达到阈值后打开，直接快速失败', async () => {
    const time = clock();
    let calls = 0;
    const breaker = impl.createCircuitBreaker({
      failureThreshold: 2,
      cooldownMs: 1000,
      now: time.now,
    });
    const action = async (): Promise<string> => {
      calls += 1;
      throw new Error('downstream failed');
    };

    await expect(breaker.execute(action)).rejects.toThrowError(
      'downstream failed',
    );
    await expect(breaker.execute(action)).rejects.toThrowError(
      'downstream failed',
    );
    expect(breaker.state()).toBe('open');

    await expect(breaker.execute(action)).rejects.toBeInstanceOf(
      impl.CircuitOpenError,
    );
    expect(calls).toBe(2);
  });

  it('冷却后探测成功则恢复 closed', async () => {
    const time = clock();
    const breaker = impl.createCircuitBreaker({
      failureThreshold: 1,
      cooldownMs: 100,
      now: time.now,
    });

    await expect(
      breaker.execute(async () => {
        throw new Error('fail');
      }),
    ).rejects.toThrowError('fail');
    expect(breaker.state()).toBe('open');

    await expect(
      breaker.execute(async () => 'never'),
    ).rejects.toBeInstanceOf(impl.CircuitOpenError);

    time.advance(100);
    await expect(breaker.execute(async () => 'recovered')).resolves.toBe(
      'recovered',
    );
    expect(breaker.state()).toBe('closed');
  });

  it('半开探测失败会重新打开', async () => {
    const time = clock();
    const breaker = impl.createCircuitBreaker({
      failureThreshold: 1,
      cooldownMs: 50,
      now: time.now,
    });

    await expect(
      breaker.execute(async () => {
        throw new Error('first');
      }),
    ).rejects.toThrowError('first');

    time.advance(50);
    await expect(
      breaker.execute(async () => {
        throw new Error('probe failed');
      }),
    ).rejects.toThrowError('probe failed');
    expect(breaker.state()).toBe('open');

    await expect(
      breaker.execute(async () => 'x'),
    ).rejects.toBeInstanceOf(impl.CircuitOpenError);
  });

  it('成功会清零连续失败计数', async () => {
    const breaker = impl.createCircuitBreaker({
      failureThreshold: 2,
      cooldownMs: 100,
    });

    await expect(
      breaker.execute(async () => {
        throw new Error('one');
      }),
    ).rejects.toThrowError('one');
    await expect(breaker.execute(async () => 'ok')).resolves.toBe('ok');
    await expect(
      breaker.execute(async () => {
        throw new Error('two');
      }),
    ).rejects.toThrowError('two');

    expect(breaker.state()).toBe('closed');
  });

  it('拒绝非法参数并支持 reset', async () => {
    expect(() =>
      impl.createCircuitBreaker({ failureThreshold: 0 }),
    ).toThrowError(RangeError);
    expect(() =>
      impl.createCircuitBreaker({ cooldownMs: 0 }),
    ).toThrowError(RangeError);

    const breaker = impl.createCircuitBreaker({
      failureThreshold: 1,
      cooldownMs: 100,
    });
    await expect(
      breaker.execute(async () => {
        throw new Error('fail');
      }),
    ).rejects.toThrowError('fail');
    expect(breaker.state()).toBe('open');

    breaker.reset();
    expect(breaker.state()).toBe('closed');
  });
});
