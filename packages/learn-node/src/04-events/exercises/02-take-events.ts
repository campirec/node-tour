import type { EventEmitter } from 'node:events';

/**
 * 练习 2：收集前 N 个事件。
 *
 * 场景：采样指标、等待批量日志、读取有限事件流。
 *
 * 要求：
 * - 使用 node:events 的异步迭代器 on()，不要手写监听器数组；
 * - 收集到 count 个事件后立即停止，并移除监听器；
 * - 支持 AbortSignal；中止时以 AbortError 拒绝；
 * - count 必须是正整数。
 */
export async function takeEvents<T = unknown>(
  emitter: EventEmitter,
  event: string,
  count: number,
  signal?: AbortSignal,
): Promise<T[]> {
  // TODO: for await (const args of on(emitter, event, { signal }))
  throw new Error('TODO: takeEvents');
}
