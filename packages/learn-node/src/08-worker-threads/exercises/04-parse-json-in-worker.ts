import { Worker } from 'node:worker_threads';

/**
 * 企业级练习：把大 JSON 解析放到 Worker
 *
 * 场景：处理几十 MB 的配置/事件导入时，JSON.parse 是同步 CPU 操作，
 * 在主线程执行会阻塞全部 HTTP 请求。放到 Worker 线程解析可保持主线程响应。
 *
 * Worker 协议（fixtures/json-parse-worker.mjs）
 *   主线程 -> worker: workerData = { text }
 *   worker -> 主线程: { ok: true, value } 或 { ok: false, error }
 *
 * 函数签名
 *   parseJsonInWorker<T>(text: string, timeoutMs?: number): Promise<T>
 *   - text：待解析的 JSON 字符串
 *   - timeoutMs：超时毫秒数，默认 5000
 *   - 返回：解析后的对象（泛型 T）
 *
 * 示例
 *   parseJsonInWorker(JSON.stringify({ items: [...] }))
 *   => { items: [...] }（解析后的原始对象）
 *
 *   parseJsonInWorker('{broken')
 *   => 抛 Error，信息匹配 /JSON|Unexpected|position/i
 *
 * 要求
 *   1. 使用 fixtures/json-parse-worker.mjs，通过 workerData 传入 { text }；
 *   2. Worker 回复 ok=true 时 resolve value；ok=false 时转为普通 Error reject；
 *   3. 默认 5000ms 超时，超时调用 terminate() 终止 Worker 并 reject；
 *   4. text 必须是字符串，否则抛 TypeError；
 *   5. timeoutMs 必须是正数，否则抛 RangeError；
 *   6. Worker error 事件与非零退出码时 reject。
 */
export async function parseJsonInWorker<T = unknown>(
  text: string,
  timeoutMs = 5000,
): Promise<T> {
  // TODO
  throw new Error('TODO: parseJsonInWorker');
}
