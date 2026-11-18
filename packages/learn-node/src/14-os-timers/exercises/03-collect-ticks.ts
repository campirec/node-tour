import { setInterval } from 'node:timers/promises';

/**
 * 练习 3：用异步迭代器收集固定数量的定时 tick
 *
 * 场景：定时采样、心跳监控。需要按固定间隔收集若干个时间戳，
 * 收集完毕后确保定时器被清理，不阻止进程退出。
 *
 * 函数签名
 *   collectTicks(count: number, intervalMs: number): Promise<number[]>
 *   - count：要收集的 tick 数量，必须是 >= 0 的整数
 *   - intervalMs：间隔毫秒数，必须是 >= 0 的有限数字
 *   - 返回：长度为 count 的时间戳数组（Date.now() 值）
 *
 * 示例
 *   collectTicks(3, 10)
 *   => [1718000000000, 1718000000010, 1718000000020]（递增的时间戳）
 *
 *   collectTicks(0, 10)
 *   => []
 *
 *   collectTicks(-1, 10)   => 抛 RangeError
 *   collectTicks(1.5, 10)  => 抛 RangeError
 *   collectTicks(1, -5)    => 抛 RangeError
 *
 * 要求
 *   1. 使用 node:timers/promises 的 setInterval 异步迭代器；
 *   2. 收集 count 个时间戳后 break，并在 finally 中清理迭代器（return()）；
 *   3. 使用 { ref: false }，避免定时器阻止进程退出；
 *   4. count 必须是 >= 0 的整数，否则抛 RangeError；
 *   5. intervalMs 必须是 >= 0 的有限数字，否则抛 RangeError；
 *   6. count 为 0 时立即返回空数组 []，不创建定时器。
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
