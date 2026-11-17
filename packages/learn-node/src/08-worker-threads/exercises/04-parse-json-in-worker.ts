import { Worker } from 'node:worker_threads';

/**
 * 企业级练习：把大 JSON 解析放到 Worker。
 *
 * 场景：处理几十 MB 的配置/事件导入时，JSON.parse 是同步 CPU 操作，
 * 在主线程执行会阻塞全部 HTTP 请求。
 *
 * 要求：
 * - 使用 fixtures/json-parse-worker.mjs；
 * - 通过 workerData 传入文本，返回解析后的对象；
 * - 解析失败时把 Worker 的错误信息转成普通 Error；
 * - 默认 5000ms 超时，超时 terminate；
 * - text 必须是字符串，timeoutMs 必须是正数。
 */
export async function parseJsonInWorker<T = unknown>(
  text: string,
  timeoutMs = 5000,
): Promise<T> {
  // TODO
  throw new Error('TODO: parseJsonInWorker');
}
