import type { EventEmitter } from 'node:events';

/**
 * 练习 2：收集前 N 个事件参数
 *
 * 场景：采样指标、等待批量日志、读取有限事件流。需要从持续发射的
 * EventEmitter 中取前 count 个事件参数，取满即停。
 *
 * 函数签名
 *   takeEvents<T>(emitter: EventEmitter, event: string,
 *                 count: number, signal?: AbortSignal): Promise<T[]>
 *   - emitter：事件源
 *   - event：事件名
 *   - count：要收集的事件数，必须是正整数，否则抛 RangeError
 *   - signal：可选 AbortSignal，中止时以 AbortError 拒绝
 *   - 返回：前 count 个事件的第一参数数组
 *
 * 示例
 *   const emitter = new EventEmitter()
 *   const p = takeEvents<number>(emitter, 'tick', 3)
 *   setImmediate(() => {
 *     emitter.emit('tick', 1); emitter.emit('tick', 2)
 *     emitter.emit('tick', 3); emitter.emit('tick', 4)
 *   })
 *   await p  => [1, 2, 3]
 *
 *   const ctrl = new AbortController()
 *   takeEvents(emitter, 'tick', 1, ctrl.signal)
 *   ctrl.abort()  => 抛 AbortError
 *
 * 要求
 *   1. 使用 node:events 的异步迭代器 on()，不要手写监听器数组；
 *   2. 收集到 count 个事件后立即停止，并移除监听器（iterator.return）；
 *   3. 支持 AbortSignal，中止时以 AbortError 拒绝并清理监听器；
 *   4. count 必须是正整数，否则抛 RangeError。
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
