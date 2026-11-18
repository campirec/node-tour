import type { EventEmitter } from 'node:events';

/**
 * 企业级练习：事件批处理
 *
 * 场景：审计日志、指标上报、批量写数据库。逐条处理会造成大量 I/O 与事务开销，
 * 需要按大小或时间窗口攒批后统一处理。
 *
 * 函数签名
 *   batchEvents<T>(emitter: EventEmitter, event: string,
 *                  options: BatchOptions<T>): EventBatcher
 *   - options.maxBatchSize：每批最大条数，必须是正整数，否则抛 RangeError
 *   - options.maxDelayMs：最大延迟毫秒，>= 0 的有限数字，否则抛 RangeError
 *   - options.onBatch：批次回调 (items: T[]) => void | Promise<void>
 *   - options.onError：onBatch 抛错时的回调
 *
 *   EventBatcher.flush(): Promise<void>
 *   - 立即处理当前缓冲区中的事件，清空定时器
 *
 *   EventBatcher.dispose(): Promise<void>
 *   - 移除监听器并处理剩余事件，幂等
 *
 * 示例
 *   const batcher = batchEvents<number>(emitter, 'audit', {
 *     maxBatchSize: 2, maxDelayMs: 100,
 *     onBatch: (items) => console.log(items),
 *   })
 *   emitter.emit('audit', 1)
 *   emitter.emit('audit', 2)  // 达到 maxBatchSize，立即触发 [1, 2]
 *   emitter.emit('audit', 3)
 *   await batcher.flush()     // 触发 [3]
 *   await batcher.dispose()
 *
 * 要求
 *   1. 收到事件后按 maxBatchSize 或 maxDelayMs 触发 onBatch；
 *   2. onBatch 异步执行时，后续事件继续进入下一批缓冲区，不丢事件；
 *   3. flush() 立即处理当前缓冲区，清空定时器；dispose() 移除监听并处理剩余事件；
 *   4. onBatch 抛错时调用 onError（若提供），不中断事件订阅，后续批次正常处理；
 *   5. maxBatchSize 必须是正整数，maxDelayMs 必须是 >= 0 的有限数字，否则抛 RangeError；
 *   6. onBatch 必须是函数，否则抛 TypeError。
 */
export interface BatchOptions<T> {
  maxBatchSize: number;
  maxDelayMs: number;
  onBatch: (items: T[]) => void | Promise<void>;
  onError?: (error: unknown) => void;
}

export interface EventBatcher {
  flush(): Promise<void>;
  dispose(): Promise<void>;
}

export function batchEvents<T = unknown>(
  emitter: EventEmitter,
  event: string,
  options: BatchOptions<T>,
): EventBatcher {
  // TODO
  throw new Error('TODO: batchEvents');
}
