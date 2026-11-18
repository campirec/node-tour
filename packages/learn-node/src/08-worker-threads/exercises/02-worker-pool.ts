import { Worker } from 'node:worker_threads';

/**
 * 练习 2：实现固定大小的 Worker 池
 *
 * 场景：批量处理大量同质任务时，反复创建/销毁 Worker 开销大。
 * 固定数量的 Worker 循环领取任务，复用线程资源。
 *
 * 协议（与 fixtures/square-worker.mjs 一致）
 *   主线程 -> worker: { id, value }
 *   worker -> 主线程: { id, result, threadId }
 *
 * 函数签名
 *   runInPool<T>(workerUrl: URL | string, values: readonly unknown[], size?: number): Promise<Array<PoolResult<T>>>
 *   - workerUrl：Worker 脚本路径
 *   - values：待处理的值数组，每个元素作为一个任务发给 worker
 *   - size：并发 Worker 数量，默认 2
 *   - 返回：按输入顺序排列的 { result, threadId } 数组
 *
 * 示例
 *   runInPool(worker('square-worker.mjs'), [1, 2, 3, 4, 5, 6], 2)
 *   => [{ result: 1, threadId }, { result: 4, threadId }, ..., { result: 36, threadId }]
 *      （最多使用 2 个不同的 threadId）
 *
 * 要求
 *   1. 同时最多运行 size 个 Worker（实际数量 = min(size, values.length)）；
 *   2. 结果按输入顺序排列（通过 id 映射回原位置），每项附带处理它的 threadId；
 *   3. 所有任务完成后 terminate 所有 Worker，进程可以退出；
 *   4. 任一 Worker 出错（error 事件或非零退出码）时终止全部并 reject；
 *   5. size 必须是正整数（>= 1），否则抛 RangeError；
 *   6. values 为空数组时直接返回 []，不创建任何 Worker。
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
