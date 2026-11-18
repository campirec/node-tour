/**
 * 企业级练习：并发限制（p-limit）
 *
 * 场景：批量调用下游 API、并发上传文件、批量处理消息。无限制并发会打爆
 * 下游或耗尽本地资源，串行又太慢，需要控制同时运行的任务数。
 *
 * 函数签名
 *   pLimit(concurrency: number):
 *     <T>(fn: AsyncTask<T>, options?: LimitOptions) => Promise<T>
 *   - concurrency：最大并发数，正整数
 *   - fn：要执行的异步任务（返回 Promise 的函数）
 *   - options.signal：AbortSignal；调用时已中止则立即 reject，排队中的任务在轮到它时 reject
 *   - 返回：每个任务对应一个 Promise，resolve 为原任务结果
 *
 * 示例
 *   const limit = pLimit(2);
 *   const results = await Promise.all([1,2,3,4,5].map(n =>
 *     limit(async () => n * 10)
 *   ));
 *   // 同时最多运行 2 个，结果按提交顺序
 *   => [10, 20, 30, 40, 50]，maxRunning = 2
 *
 *   const limit = pLimit(1);
 *   limit(async () => 'done');        // 立即运行
 *   limit(async () => 'never', { signal: controller.signal });
 *   controller.abort();
 *   // 第一个仍 resolve 'done'；它让出槽位后，第二个才被调度并以 AbortError reject
 *
 *   pLimit(0)    => 抛 RangeError
 *   pLimit(1.5)  => 抛 RangeError
 *
 * 要求
 *   1. 返回 limit 函数，同时最多运行 concurrency 个任务；
 *   2. 超出并发上限的任务排队等待，按提交顺序执行（FIFO）；
 *   3. 每个任务返回的 Promise resolve 为原任务结果，按提交顺序对应；
 *   4. 某个任务失败（reject）不影响其他任务，各自独立 settle；
 *   5. AbortSignal 已中止时：调用 limit 立刻得到 rejected Promise；排队中的任务在
 *      轮到自己时以 AbortError reject；正在运行的任务不强制中断；
 *   6. concurrency 必须是正整数，否则抛 RangeError。
 */
export interface LimitOptions {
  signal?: AbortSignal;
}

export type AsyncTask<T> = () => Promise<T>;

export function pLimit(concurrency: number): <T>(fn: AsyncTask<T>, options?: LimitOptions) => Promise<T> {
  // TODO: 返回 <T>(fn: AsyncTask<T>, options?: LimitOptions) => Promise<T>
  throw new Error('TODO: pLimit');
}
