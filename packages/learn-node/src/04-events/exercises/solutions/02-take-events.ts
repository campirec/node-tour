import { on } from 'node:events';
import type { EventEmitter } from 'node:events';

export async function takeEvents<T = unknown>(
  emitter: EventEmitter,
  event: string,
  count: number,
  signal?: AbortSignal,
): Promise<T[]> {
  if (!Number.isInteger(count) || count < 1) {
    throw new RangeError('count 必须是正整数');
  }

  const iterator = on(emitter, event, signal ? { signal } : undefined);
  const values: T[] = [];

  try {
    for await (const args of iterator) {
      values.push(args[0] as T);
      if (values.length >= count) {
        break;
      }
    }
  } finally {
    await iterator.return?.();
  }

  return values;
}
