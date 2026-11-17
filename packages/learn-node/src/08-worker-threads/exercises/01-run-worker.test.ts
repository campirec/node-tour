import { describe, expect, it } from 'vitest';
import { loadImpl } from '../../shared/load-impl.js';

const impl = await loadImpl({
  exercise: () => import('./01-run-worker.js'),
  solution: () => import('./solutions/01-run-worker.js'),
});

const worker = (name: string): URL =>
  new URL(`../fixtures/${name}`, import.meta.url);

interface EchoResult {
  workerData: { value: number };
  threadId: number;
}

describe('runWorker', () => {
  it('通过 workerData 传参并返回消息', async () => {
    const result = await impl.runWorker<EchoResult>(
      worker('echo-worker.mjs'),
      { value: 7 },
    );

    expect(result.workerData).toEqual({ value: 7 });
    expect(result.threadId).toBeGreaterThan(0);
  });

  it('worker 抛错时拒绝', async () => {
    await expect(
      impl.runWorker(worker('throw-worker.mjs'), null),
    ).rejects.toThrowError('worker 启动失败');
  });

  it('超时会终止 worker', async () => {
    await expect(
      impl.runWorker(worker('hang-worker.mjs'), null, { timeoutMs: 30 }),
    ).rejects.toThrowError('Worker 超时（30ms）');
  });
});
