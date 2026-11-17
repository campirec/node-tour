import { describe, expect, it } from 'vitest';
import { loadImpl } from '../../shared/load-impl.js';

const impl = await loadImpl({
  exercise: () => import('./05-event-loop-lag.js'),
  solution: () => import('./solutions/05-event-loop-lag.js'),
});

describe('measureEventLoopLag', () => {
  it('返回非负的延迟统计', async () => {
    const stats = await impl.measureEventLoopLag(60, 5);

    expect(stats.samples).toBeGreaterThan(0);
    expect(stats.p50Ms).toBeGreaterThanOrEqual(0);
    expect(stats.p99Ms).toBeGreaterThanOrEqual(stats.p50Ms);
    expect(stats.maxMs).toBeGreaterThanOrEqual(0);
    expect(Number.isFinite(stats.maxMs)).toBe(true);
  });

  it('拒绝非法参数', async () => {
    await expect(impl.measureEventLoopLag(0)).rejects.toBeInstanceOf(
      RangeError,
    );
    await expect(
      impl.measureEventLoopLag(10, 0),
    ).rejects.toBeInstanceOf(RangeError);
    await expect(
      impl.measureEventLoopLag(Number.NaN),
    ).rejects.toBeInstanceOf(RangeError);
  });
});
