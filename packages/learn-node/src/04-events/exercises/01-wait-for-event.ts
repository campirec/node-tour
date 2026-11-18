import type { EventEmitter } from 'node:events';

/**
 * 练习 1：等待单个事件触发并获取参数
 *
 * 场景：等待测试环境 ready、等待子进程首次输出、等待连接建立。
 * 需要 Promise 化的一次性等待，且自带超时和错误处理。
 *
 * 函数签名
 *   waitForEvent(emitter: EventEmitter, event: string, timeoutMs?: number): Promise<unknown[]>
 *   - emitter：事件源
 *   - event：要等待的事件名
 *   - timeoutMs：超时毫秒数，省略则不超时
 *   - 返回：事件触发时的全部参数数组（once 返回值）
 *
 * 示例
 *   const emitter = new EventEmitter()
 *   const p = waitForEvent(emitter, 'ready', 200)
 *   setTimeout(() => emitter.emit('ready', 'ok', 42), 5)
 *   await p  => ['ok', 42]
 *
 *   waitForEvent(emitter, 'never', 10)
 *   => 抛 Error('等待事件 never 超时（10ms）')
 *
 *   // 等待期间 emitter 触发 'error'
 *   waitForEvent(emitter, 'ready', 200)
 *   => reject 该 Error，错误信息为原始 error 的 message
 *
 * 要求
 *   1. 返回事件 emit 时的全部参数数组；
 *   2. 指定 timeoutMs 时，超时后抛 Error('等待事件 <event> 超时（<ms>ms）')，
 *      并将原始 AbortError 作为 cause；
 *   3. 等待期间 emitter 触发 'error' 事件时直接 reject 该错误；
 *   4. 无论成功、超时还是出错，都不在 emitter 上残留监听器。
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
