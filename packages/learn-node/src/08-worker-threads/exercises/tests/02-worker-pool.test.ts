import { describe, expect, it } from 'vitest';
import { loadImpl } from '../../../shared/load-impl.js';

const impl = await loadImpl({
  exercise: () => import('../02-worker-pool.js'),
  solution: () => import('../solutions/02-worker-pool.js'),
});

const worker = (name: string): URL =>
  new URL(`../../fixtures/${name}`, import.meta.url);

describe('runInPool', () => {
  it('按输入顺序返回结果，并复用有限的 worker', async () => {
    const values = [1, 2, 3, 4, 5, 6];

    const results = await impl.runInPool(
      worker('square-worker.mjs'),
      values,
      2,
    );

    expect(results.map((item) => item.result)).toEqual([
      1, 4, 9, 16, 25, 36,
    ]);
    expect(new Set(results.map((item) => item.threadId)).size).toBeLessThanOrEqual(2);
  });

  it('空任务不创建 worker', async () => {
    await expect(
      impl.runInPool(worker('square-worker.mjs'), [], 4),
    ).resolves.toEqual([]);
  });

  it('拒绝非法 size', async () => {
    await expect(
      impl.runInPool(worker('square-worker.mjs'), [1], 0),
    ).rejects.toBeInstanceOf(RangeError);
  });
});
