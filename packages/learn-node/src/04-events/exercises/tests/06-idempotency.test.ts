import { setTimeout as sleep } from 'node:timers/promises';
import { describe, expect, it } from 'vitest';
import { loadImpl } from '../../../shared/load-impl.js';

const impl = await loadImpl({
  exercise: () => import('../06-idempotency.js'),
  solution: () => import('../solutions/06-idempotency.js'),
});

function clock(): { now: () => number; advance: (ms: number) => void } {
  let current = 0;
  return {
    now: () => current,
    advance: (ms) => { current += ms; },
  };
}

describe('createIdempotentExecutor', () => {
  it('同一 key 只执行一次，返回缓存结果', async () => {
    const executor = impl.createIdempotentExecutor();
    let calls = 0;
    const fn = async () => {
      calls += 1;
      return { orderId: 'ord-1', status: 'created' };
    };

    const first = await executor.run('key-1', fn);
    const second = await executor.run('key-1', fn);

    expect(first).toEqual(second);
    expect(calls).toBe(1);
  });

  it('不同 key 独立执行', async () => {
    const executor = impl.createIdempotentExecutor();
    let calls = 0;
    const fn = async () => {
      calls += 1;
      return calls;
    };

    await executor.run('a', fn);
    await executor.run('b', fn);

    expect(calls).toBe(2);
  });

  it('执行失败不缓存，允许重试', async () => {
    const executor = impl.createIdempotentExecutor();
    let calls = 0;

    await expect(
      executor.run('key-1', async () => {
        calls += 1;
        throw new Error('db down');
      }),
    ).rejects.toThrowError('db down');

    const result = await executor.run('key-1', async () => {
      calls += 1;
      return 'ok';
    });

    expect(result).toBe('ok');
    expect(calls).toBe(2);
  });

  it('TTL 到期后允许重新执行', async () => {
    const time = clock();
    const executor = impl.createIdempotentExecutor({ ttlMs: 100, now: time.now });
    let calls = 0;
    const fn = async () => { calls += 1; return calls; };

    await executor.run('k', fn);
    expect(calls).toBe(1);

    time.advance(100);
    await executor.run('k', fn);
    expect(calls).toBe(2);
  });

  it('maxEntries 限制内存占用', () => {
    const executor = impl.createIdempotentExecutor({ maxEntries: 2 });
    void executor.run('a', async () => 1);
    void executor.run('b', async () => 2);
    void executor.run('c', async () => 3);

    expect(executor.size()).toBeLessThanOrEqual(2);
  });

  it('并发相同 key 的第二个请求抛 IdempotencyConflictError', async () => {
    const executor = impl.createIdempotentExecutor();
    const first = executor.run('key', async () => {
      await sleep(50);
      return 'done';
    });

    await expect(
      executor.run('key', async () => 'other'),
    ).rejects.toBeInstanceOf(impl.IdempotencyConflictError);

    await expect(first).resolves.toBe('done');
  });
});
