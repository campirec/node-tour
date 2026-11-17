import { describe, expect, it } from 'vitest';
import { loadImpl } from '../../shared/load-impl.js';

const impl = await loadImpl({
  exercise: () => import('./03-collect-ticks.js'),
  solution: () => import('./solutions/03-collect-ticks.js'),
});

describe('collectTicks', () => {
  it('收集指定数量的时间戳', async () => {
    const ticks = await impl.collectTicks(3, 10);

    expect(ticks).toHaveLength(3);
    expect(ticks.every((tick) => Number.isFinite(tick))).toBe(true);
    expect(ticks[1]!).toBeGreaterThanOrEqual(ticks[0]!);
    expect(ticks[2]!).toBeGreaterThanOrEqual(ticks[1]!);
  });

  it('count 为 0 时立即返回', async () => {
    await expect(impl.collectTicks(0, 10)).resolves.toEqual([]);
  });

  it('非法参数抛出 RangeError', async () => {
    await expect(impl.collectTicks(-1, 10)).rejects.toBeInstanceOf(RangeError);
    await expect(impl.collectTicks(1.5, 10)).rejects.toBeInstanceOf(RangeError);
    await expect(impl.collectTicks(1, -5)).rejects.toBeInstanceOf(RangeError);
  });
});
