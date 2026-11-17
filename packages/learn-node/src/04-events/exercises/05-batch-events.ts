import type { EventEmitter } from 'node:events';

/**
 * 企业级练习：事件批处理。
 *
 * 场景：审计日志、指标上报、批量写数据库。逐条处理会造成大量 I/O 与事务开销。
 *
 * 要求：
 * - 收到事件后按 maxBatchSize 或 maxDelayMs 触发 onBatch；
 * - onBatch 异步执行时，后续事件继续进入下一批，不丢事件；
 * - flush() 立即处理当前缓冲区；dispose() 移除监听并处理剩余事件；
 * - onBatch 抛错时调用 onError（若提供），不中断事件订阅；
 * - maxBatchSize 必须是正整数，maxDelayMs 必须是 >= 0 的有限数字。
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
