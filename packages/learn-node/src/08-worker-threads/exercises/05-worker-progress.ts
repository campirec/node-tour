/**
 * 企业级练习：接收 Worker 进度并等待最终结果。
 *
 * 场景：批量导入、视频转码、报表生成需要向调用方报告进度。
 *
 * 要求：
 * - 使用 fixtures/progress-worker.mjs 协议：
 *   { type: 'progress', done, total } / { type: 'result', value }
 * - onProgress 每收到一次进度调用一次；
 * - 收到 result 后 resolve；
 * - onProgress 抛错时终止 Worker 并 reject；
 * - 支持超时（默认 5000ms），超时 terminate；
 * - 拒绝非法 timeoutMs。
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
