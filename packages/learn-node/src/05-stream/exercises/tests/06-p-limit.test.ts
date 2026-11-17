import { setTimeout as sleep } from 'node:timers/promises';
import { describe, expect, it } from 'vitest';
import { loadImpl } from '../../../shared/load-impl.js';

const impl = await loadImpl({
  exercise: () => import('../06-p-limit.js'),
  solution: () => import('../solutions/06-p-limit.js'),
});

describe('pLimit', () => {
  it('限制并发数，结果按提交顺序返回', async () => {
    const limit = impl.pLimit(2);
    let running = 0;
    let maxRunning = 0;
    const order: number[] = [];

    const tasks = [1, 2, 3, 4, 5].map((n) =>
      limit(async () => {
        running += 1;
        maxRunning = Math.max(maxRunning, running);
        await sleep(10);
        running -= 1;
        order.push(n);
        return n * 10;
      }),
    );

    const results = await Promise.all(tasks);

    expect(results).toEqual([10, 20, 30, 40, 50]);
    expect(maxRunning).toBe(2);
  });

  it('任务失败不影响其他任务', async () => {
    const limit = impl.pLimit(2);
    const tasks = [
      limit(async () => 'a'),
      limit(async () => { throw new Error('fail'); }),
      limit(async () => 'c'),
    ];

    const results = await Promise.allSettled(tasks);

    expect(results[0]).toEqual({ status: 'fulfilled', value: 'a' });
    expect(results[1]).toEqual({ status: 'rejected', reason: expect.any(Error) });
    expect(results[2]).toEqual({ status: 'fulfilled', value: 'c' });
  });

  it('AbortSignal 中止排队中的任务', async () => {
    const limit = impl.pLimit(1);
    const controller = new AbortController();

    const first = limit(async () => {
      await sleep(50);
      return 'done';
    });
    const second = limit(async () => 'never', { signal: controller.signal });

    controller.abort();

    await expect(second).rejects.toMatchObject({ name: 'AbortError' });
    await expect(first).resolves.toBe('done');
  });

  it('拒绝非法 concurrency', () => {
    expect(() => impl.pLimit(0)).toThrowError(RangeError);
    expect(() => impl.pLimit(1.5)).toThrowError(RangeError);
  });
});
