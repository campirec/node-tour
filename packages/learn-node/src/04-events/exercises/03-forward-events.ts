import type { EventEmitter } from 'node:events';

/**
 * 练习 3：把一组事件从 source 转发到 target
 *
 * 场景：把底层连接事件桥接到业务 EventEmitter，或在测试中观察事件。
 * 需要按事件名列表注册监听器，dispose 后干净拆除。
 *
 * 函数签名
 *   forwardEvents(source: EventEmitter, target: EventEmitter,
 *                 events: readonly string[]): () => void
 *   - source：事件源
 *   - target：转发目标
 *   - events：要转发的事件名列表，重复名称只注册一次
 *   - 返回：dispose 函数，调用后停止转发并移除 source 上所有相关监听器
 *
 * 示例
 *   const source = new EventEmitter()
 *   const target = new EventEmitter()
 *   target.on('data', (...args) => console.log(args))
 *   const dispose = forwardEvents(source, target, ['data', 'data'])
 *   source.emit('data', 'a', 1)   // target 收到 ['a', 1]
 *   source.emit('other', 'x')     // 未登记，不转发
 *   dispose()                      // source 上 data 监听器数为 0
 *
 * 要求
 *   1. 按 events 列表在 source 上注册监听器，将事件参数原样转发到 target；
 *   2. 重复的事件名只注册一次监听器（使用 Set 去重）；
 *   3. 未登记的事件不被转发；
 *   4. 返回的 dispose 函数幂等：调用后停止转发，移除 source 上所有相关监听器，
 *      重复调用无副作用。
 */
export function forwardEvents(
  source: EventEmitter,
  target: EventEmitter,
  events: readonly string[],
): () => void {
  // TODO: target.emit(event, ...args) 包一层监听器
  throw new Error('TODO: forwardEvents');
}
