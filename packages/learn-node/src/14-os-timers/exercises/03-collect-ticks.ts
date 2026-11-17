import { setInterval } from 'node:timers/promises';

/**
 * 练习 3：用异步迭代器收集固定数量的定时 tick。
 *
 * 要求：
 * - 使用 node:timers/promises 的 setInterval 异步迭代器；
 * - 收集 count 个时间戳后 break，并确保定时器被清理；
 * - 使用 { ref: false }，避免定时器阻止进程退出；
 * - count 必须是 >= 0 的整数，intervalMs 必须是 >= 0 的有限数字；
 * - count 为 0 时立即返回 []。
 *
 * 注意：setInterval 不保证精确间隔，事件循环繁忙时会漂移。
 */
export async function collectTicks(
  count: number,
  intervalMs: number,
): Promise<number[]> {
  // TODO
  throw new Error('TODO: collectTicks');
}
