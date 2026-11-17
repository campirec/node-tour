import { setTimeout as sleep } from 'node:timers/promises';
import { describe, expect, it } from 'vitest';
import { loadImpl } from '../../shared/load-impl.js';

const impl = await loadImpl({
  exercise: () => import('./06-timeout.js'),
  solution: () => import('./solutions/06-timeout.js'),
});

describe('withTimeout', () => {
  it('正常完成的 Promise 直接返回结果', async () => {
    const result = await impl.withTimeout(
      Promise.resolve('ok'),
      { timeoutMs: 100 },
    );

    expect(result).toBe('ok');
  });

  it('超时后抛 TimeoutError', async () => {
    const slow = sleep(200).then(() => 'done');

    await expect(
      impl.withTimeout(slow, { timeoutMs: 20 }),
    ).rejects.toMatchObject({
      name: 'TimeoutError',
      timeoutMs: 20,
    });
  });

  it('原 Promise 在超时后仍然完成', async () => {
    let completed = false;
    const slow = sleep(50).then(() => {
      completed = true;
      return 'done';
    });

    await expect(
      impl.withTimeout(slow, { timeoutMs: 10 }),
    ).rejects.toThrowError('超时');

    await sleep(60);
    expect(completed).toBe(true);
  });

  it('AbortSignal 中止时以 AbortError 拒绝', async () => {
    const controller = new AbortController();
    const slow = sleep(1000).then(() => 'done');

    const promise = impl.withTimeout(slow, {
      timeoutMs: 1000,
      signal: controller.signal,
    });
    controller.abort();

    await expect(promise).rejects.toMatchObject({ name: 'AbortError' });
  });

  it('拒绝非法 timeoutMs', async () => {
    await expect(
      impl.withTimeout(Promise.resolve(), { timeoutMs: 0 }),
    ).rejects.toBeInstanceOf(RangeError);
    await expect(
      impl.withTimeout(Promise.resolve(), { timeoutMs: -1 }),
    ).rejects.toBeInstanceOf(RangeError);
  });
});
