import { setTimeout as sleep } from 'node:timers/promises';

export async function delay(
  ms: number,
  signal?: AbortSignal,
): Promise<void> {
  if (!Number.isFinite(ms) || ms < 0) {
    throw new RangeError('ms 必须是 >= 0 的有限数字');
  }

  await sleep(ms, undefined, signal ? { signal } : undefined);
}
