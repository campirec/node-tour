/**
 * 企业级练习：接收 Worker 进度并等待最终结果
 *
 * 场景：批量导入、视频转码、报表生成需要向调用方报告进度。Worker 在处理过程中
 * 逐步发送 progress 消息，完成后发送 result。
 *
 * Worker 消息协议（fixtures/progress-worker.mjs）
 *   { type: 'progress', done: number, total: number }
 *   { type: 'result', value: unknown }
 *
 * 函数签名
 *   runWorkerWithProgress<T>(workerUrl: URL | string, workerData: unknown,
 *     onProgress: (progress: WorkerProgress) => void, timeoutMs?: number): Promise<T>
 *   - workerUrl：Worker 脚本路径
 *   - workerData：传给 Worker 的数据
 *   - onProgress：进度回调，每收到一条 progress 消息调用一次
 *   - timeoutMs：超时毫秒数，默认 5000
 *   - 返回：Worker 最终发回的 result.value
 *
 * 示例
 *   const progress: WorkerProgress[] = [];
 *   await runWorkerWithProgress(worker('progress-worker.mjs'), { steps: 3, value: 21 },
 *     (p) => progress.push(p))
 *   => 42
 *   // progress 依次为 [{ done: 1, total: 3 }, { done: 2, total: 3 }, { done: 3, total: 3 }]
 *
 * 要求
 *   1. 每收到 { type: 'progress' } 消息时调用 onProgress({ done, total })；
 *   2. 收到 { type: 'result' } 消息时 resolve value，并清理监听器与定时器；
 *   3. onProgress 抛错时终止 Worker 并以该错误 reject；
 *   4. timeoutMs 必须是正数，否则抛 RangeError；
 *   5. 默认 5000ms 超时，超时调用 terminate() 终止 Worker，
 *      抛 Error(`Worker 超时（${timeoutMs}ms）`)；
 *   6. Worker error 事件与非零退出码时 reject。
 */
export interface WorkerProgress {
  done: number;
  total: number;
}

export async function runWorkerWithProgress<T = unknown>(
  workerUrl: URL | string,
  workerData: unknown,
  onProgress: (progress: WorkerProgress) => void,
  timeoutMs = 5000,
): Promise<T> {
  // TODO
  throw new Error('TODO: runWorkerWithProgress');
}
