import { Worker } from 'node:worker_threads';

/**
 * 练习 1：运行一次性 Worker 并等待结果。
 *
 * 要求：
 * - 通过 workerData 传入参数（结构化克隆，不能传函数/DOM 对象）；
 * - 收到第一条 message 后 resolve；
 * - worker 抛错、非零退出、超时都 reject；
 * - 超时时调用 terminate()，并清理定时器与监听器；
 * - 默认超时 5000ms。
 */
export interface RunWorkerOptions {
  timeoutMs?: number;
}

export function runWorker<T = unknown>(
  workerUrl: URL | string,
  workerData: unknown,
  options: RunWorkerOptions = {},
): Promise<T> {
  // TODO: new Worker + once('message'/'error'/'exit') + terminate
  throw new Error('TODO: runWorker');
}
