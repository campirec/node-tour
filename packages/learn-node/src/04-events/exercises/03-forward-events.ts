import type { EventEmitter } from 'node:events';

/**
 * 练习 3：把一组事件从 source 转发到 target。
 *
 * 场景：把底层连接事件桥接到业务 EventEmitter，或在测试中观察事件。
 *
 * 要求：
 * - 返回幂等的 dispose 函数；
 * - dispose 后不再转发，且 source 上不残留监听器；
 * - 重复的事件名只注册一次；
 * - 事件参数原样转发。
 */
export function forwardEvents(
  source: EventEmitter,
  target: EventEmitter,
  events: readonly string[],
): () => void {
  // TODO: target.emit(event, ...args) 包一层监听器
  throw new Error('TODO: forwardEvents');
}
