import { setTimeout as sleep } from 'node:timers/promises';

/**
 * 练习 2：可取消的延迟
 *
 * 场景：重试退避、轮询间隔、请求节流。需要让异步流程暂停指定毫秒数，
 * 且支持通过 AbortSignal 中止等待。
 *
 * 函数签名
 *   delay(ms: number, signal?: AbortSignal): Promise<void>
 *   - ms：等待毫秒数，必须是 >= 0 的有限数字
 *   - signal：可选的 AbortSignal
 *   - 返回：ms 到期后 resolve；中止时 reject AbortError
 *
 * 示例
 *   delay(20)  // 等待约 20ms 后 resolve
 *
 *   const controller = new AbortController()
 *   delay(10_000, controller.signal)
 *   controller.abort()  // 立即拒绝，name 为 'AbortError'
 *
 *   delay(-1)      => 抛 RangeError
 *   delay(NaN)     => 抛 RangeError
 *
 * 要求
 *   1. 使用 node:timers/promises 的 setTimeout，不要用忙等待或同步阻塞；
 *   2. ms 必须是 >= 0 的有限数字（Number.isFinite && >= 0），否则抛 RangeError；
 *   3. 支持 AbortSignal，中止时以 AbortError 拒绝；
 *   4. 已中止的 signal 传入时立即拒绝（AbortError）。
 */
export async function delay(
  ms: number,
  signal?: AbortSignal,
): Promise<void> {
  // TODO
  throw new Error('TODO: delay');
}
