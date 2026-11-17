/**
 * 企业级练习：并发限制（p-limit）。
 *
 * 场景：批量调用下游 API、并发上传文件、批量处理消息。
 * 无限制并发会打爆下游或耗尽本地资源；串行又太慢。
 *
 * 要求：
 * - 返回一个 limit 函数，包装异步任务；
 * - 同时最多运行 concurrency 个任务；
 * - 超出并发上限的任务排队等待，按提交顺序执行；
 * - 返回 Promise，resolve 原任务结果；
 * - 支持 AbortSignal，中止时排队中的任务立即 reject，运行中的任务不强制中断；
 * - concurrency 必须是正整数。
 */
export interface LimitOptions {
  signal?: AbortSignal;
}

export type AsyncTask<T> = () => Promise<T>;

export function pLimit(concurrency: number): <T>(fn: AsyncTask<T>, options?: LimitOptions) => Promise<T> {
  // TODO: 返回 <T>(fn: AsyncTask<T>, options?: LimitOptions) => Promise<T>
  throw new Error('TODO: pLimit');
}
