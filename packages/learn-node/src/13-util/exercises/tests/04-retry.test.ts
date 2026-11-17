import { describe, expect, it } from 'vitest';
import { loadImpl } from '../../../shared/load-impl.js';

const impl = await loadImpl({
  exercise: () => import('../04-retry.js'),
  solution: () => import('../solutions/04-retry.js'),
});

describe('withRetry', () => {
  it('失败后重试并在成功时返回结果', async () => {
    const attempts: number[] = [];
    const result = await impl.withRetry(
      async (attempt) => {
        attempts.push(attempt);
        if (attempt < 3) {
          throw new Error(`fail-${attempt}`);
        }
        return 'ok';
      },
      { retries: 3, baseDelayMs: 1 },
    );

    expect(result).toBe('ok');
    expect(attempts).toEqual([1, 2, 3]);
  });

  it('shouldRetry 返回 false 时立即停止', async () => {
    let calls = 0;
    const error = Object.assign(new Error('bad request'), { status: 400 });

    await expect(
      impl.withRetry(
        async () => {
          calls += 1;
          throw error;
        },
        {
          retries: 5,
          baseDelayMs: 1,
          shouldRetry: (cause) => (cause as { status?: number }).status !== 400,
        },
      ),
    ).rejects.toBe(error);
    expect(calls).toBe(1);
  });

  it('用尽重试后抛出最后一次错误', async () => {
    let calls = 0;

    await expect(
      impl.withRetry(
        async () => {
          calls += 1;
          throw new Error(`attempt-${calls}`);
        },
        { retries: 2, baseDelayMs: 1 },
      ),
    ).rejects.toThrowError('attempt-3');
    expect(calls).toBe(3);
  });

  it('AbortSignal 中止后不再重试', async () => {
    const controller = new AbortController();
    let calls = 0;
    const promise = impl.withRetry(
      async () => {
        calls += 1;
        throw new Error('temporary');
      },
      {
        retries: 10,
        baseDelayMs: 1000,
        signal: controller.signal,
      },
    );
    setTimeout(() => controller.abort(), 20);

    await expect(promise).rejects.toMatchObject({ name: 'AbortError' });
    expect(calls).toBe(1);
  });

  it('拒绝非法参数', async () => {
    await expect(
      impl.withRetry(async () => 'x', { retries: -1 }),
    ).rejects.toBeInstanceOf(RangeError);
    await expect(
      impl.withRetry(async () => 'x', { baseDelayMs: -1 }),
    ).rejects.toBeInstanceOf(RangeError);
    await expect(
      impl.withRetry(async () => 'x', { maxDelayMs: -1 }),
    ).rejects.toBeInstanceOf(RangeError);
  });
});
