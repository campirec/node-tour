import { describe, expect, it } from 'vitest';
import { loadImpl } from '../../../shared/load-impl.js';

const impl = await loadImpl({
  exercise: () => import('../02-delay.js'),
  solution: () => import('../solutions/02-delay.js'),
});

describe('delay', () => {
  it('等待指定时间', async () => {
    const start = performance.now();
    await impl.delay(20);
    const elapsed = performance.now() - start;

    expect(elapsed).toBeGreaterThanOrEqual(10);
  });

  it('AbortSignal 可以取消等待', async () => {
    const controller = new AbortController();
    const promise = impl.delay(10_000, controller.signal);
    setTimeout(() => controller.abort(), 10);

    await expect(promise).rejects.toMatchObject({ name: 'AbortError' });
  });

  it('已经中止的 signal 立即拒绝', async () => {
    const controller = new AbortController();
    controller.abort();

    await expect(
      impl.delay(10_000, controller.signal),
    ).rejects.toMatchObject({ name: 'AbortError' });
  });

  it('非法毫秒数抛出 RangeError', async () => {
    await expect(impl.delay(-1)).rejects.toBeInstanceOf(RangeError);
    await expect(impl.delay(Number.NaN)).rejects.toBeInstanceOf(RangeError);
  });
});
