import { Worker } from 'node:worker_threads';

/**
 * 练习 2：实现固定大小的 Worker 池。
 *
 * 协议（与 fixtures/square-worker.mjs 一致）：
 *   主线程 -> worker: { id, value }
 *   worker -> 主线程: { id, result, threadId }
 *
 * 要求：
 * - 同时最多运行 size 个 worker；
 * - 结果按输入顺序返回，附带处理它的 threadId；
 * - 所有任务完成后 terminate 所有 worker，进程可以退出；
 * - 任一 worker 出错时终止全部并 reject；
 * - size 必须是正整数；空任务直接返回 []。
 *
 * 提示：维护 nextTask 指针，worker 每完成一个任务就领取下一个。
 */
export interface PoolResult<T> {
  result: T;
  threadId: number;
}

export async function runInPool<T = number>(
  workerUrl: URL | string,
  values: readonly unknown[],
  size = 2,
): Promise<Array<PoolResult<T>>> {
  // TODO
  throw new Error('TODO: runInPool');
}
