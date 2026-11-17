import { describe, expect, it } from 'vitest';
import { loadImpl } from '../../shared/load-impl.js';

const impl = await loadImpl({
  exercise: () => import('./05-worker-progress.js'),
  solution: () => import('./solutions/05-worker-progress.js'),
});

const worker = (name: string): URL =>
  new URL(`../fixtures/${name}`, import.meta.url);

describe('runWorkerWithProgress', () => {
  it('按顺序报告进度并返回结果', async () => {
    const progress: Array<{ done: number; total: number }> = [];
    const result = await impl.runWorkerWithProgress<number>(
      worker('progress-worker.mjs'),
      { steps: 3, value: 21 },
      (item) => progress.push(item),
    );

    expect(result).toBe(42);
    expect(progress).toEqual([
      { done: 1, total: 3 },
      { done: 2, total: 3 },
      { done: 3, total: 3 },
    ]);
  });

  it('onProgress 抛错时终止并拒绝', async () => {
    await expect(
      impl.runWorkerWithProgress(
        worker('progress-worker.mjs'),
        { steps: 5, value: 1 },
        () => {
          throw new Error('progress sink failed');
        },
      ),
    ).rejects.toThrowError('progress sink failed');
  });

  it('超时会终止 Worker', async () => {
    await expect(
      impl.runWorkerWithProgress(
        worker('hang-worker.mjs'),
        null,
        () => undefined,
        30,
      ),
    ).rejects.toThrowError('Worker 超时（30ms）');
  });

  it('拒绝非法 timeoutMs', async () => {
    await expect(
      impl.runWorkerWithProgress(
        worker('progress-worker.mjs'),
        { steps: 1, value: 1 },
        () => undefined,
        0,
      ),
    ).rejects.toBeInstanceOf(RangeError);
  });
});
