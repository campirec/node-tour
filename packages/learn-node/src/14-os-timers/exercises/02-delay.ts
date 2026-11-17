import { setTimeout as sleep } from 'node:timers/promises';

/**
 * 练习 2：可取消的延迟。
 *
 * 场景：重试退避、轮询间隔、请求节流。
 *
 * 要求：
 * - 使用 node:timers/promises 的 setTimeout；
 * - ms 必须是 >= 0 的有限数字，否则抛 RangeError；
 * - 支持 AbortSignal；中止时以 AbortError 拒绝；
 * - 不要用忙等待 / 同步阻塞。
 */
export async function delay(
  ms: number,
  signal?: AbortSignal,
): Promise<void> {
  // TODO
  throw new Error('TODO: delay');
}
