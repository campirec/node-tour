import { Worker } from 'node:worker_threads';

/**
 * 练习 1：运行一次性 Worker 并等待结果
 *
 * 场景：把 CPU 密集任务卸载到独立线程，避免阻塞主线程事件循环。
 * 通过 workerData 传参（结构化克隆），收到第一条消息后立即返回。
 *
 * 函数签名
 *   runWorker<T>(workerUrl: URL | string, workerData: unknown, options?: RunWorkerOptions): Promise<T>
 *   - workerUrl：Worker 脚本路径，如 new URL('./echo-worker.mjs', import.meta.url)
 *   - workerData：传给 Worker 的数据（结构化克隆，不能传函数/DOM 对象）
 *   - options.timeoutMs：超时毫秒数，默认 5000
 *   - 返回：Worker 发回的第一条消息
 *
 * 示例
 *   runWorker<EchoResult>(worker('echo-worker.mjs'), { value: 7 })
 *   => { workerData: { value: 7 }, threadId: <正整数> }
 *
 *   runWorker(worker('hang-worker.mjs'), null, { timeoutMs: 30 })
 *   => 抛 Error('Worker 超时（30ms）')
 *
 * 要求
 *   1. 使用 new Worker(workerUrl, { workerData }) 启动；
 *   2. 收到第一条 message 后 resolve，并清理监听器与定时器；
 *   3. Worker error 事件触发时 reject（保留原始错误信息）；
 *   4. 非零退出码时 reject，错误信息包含退出码；
 *   5. 超时（timeoutMs，默认 5000）时调用 terminate() 终止 Worker，
 *      抛 Error(`Worker 超时（${timeoutMs}ms）`)，并清理定时器与监听器。
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
