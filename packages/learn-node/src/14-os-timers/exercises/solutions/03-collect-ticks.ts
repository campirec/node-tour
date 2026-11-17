import { setInterval } from 'node:timers/promises';

export async function collectTicks(
  count: number,
  intervalMs: number,
): Promise<number[]> {
  if (!Number.isInteger(count) || count < 0) {
    throw new RangeError('count 必须是 >= 0 的整数');
  }
  if (!Number.isFinite(intervalMs) || intervalMs < 0) {
    throw new RangeError('intervalMs 必须是 >= 0 的有限数字');
  }
  if (count === 0) {
    return [];
  }

  const ticks: number[] = [];
  const iterator = setInterval(intervalMs, Date.now(), { ref: false });

  try {
    for await (const timestamp of iterator) {
      ticks.push(timestamp);
      if (ticks.length >= count) {
        break;
      }
    }
  } finally {
    await iterator.return?.();
  }

  return ticks;
}
