import type { EventEmitter } from 'node:events';

/**
 * 练习 1：等待单个事件。
 *
 * 场景：等待测试环境 ready、等待子进程首次输出、等待连接建立。
 *
 * 要求：
 * - 返回 emit 时的全部参数数组；
 * - 超时后 reject，错误信息包含事件名与毫秒数；
 * - 等待期间如果 emitter 触发 'error'，直接 reject 该错误；
 * - 无论成功、超时还是出错，都不留下监听器。
 *
 * 提示：node:events 的 once() 已经处理了 error 与清理，不要手写 on/off。
 */
export async function waitForEvent(
  emitter: EventEmitter,
  event: string,
  timeoutMs?: number,
): Promise<unknown[]> {
  // TODO: once(emitter, event, { signal: AbortSignal.timeout(...) })
  throw new Error('TODO: waitForEvent');
}
