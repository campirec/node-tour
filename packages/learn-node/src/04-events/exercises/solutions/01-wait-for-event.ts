import { once } from 'node:events';
import type { EventEmitter } from 'node:events';

export async function waitForEvent(
  emitter: EventEmitter,
  event: string,
  timeoutMs?: number,
): Promise<unknown[]> {
  const signal =
    timeoutMs === undefined ? undefined : AbortSignal.timeout(timeoutMs);

  try {
    return await once(emitter, event, signal ? { signal } : undefined);
  } catch (error) {
    if (signal?.aborted) {
      throw new Error(`等待事件 ${event} 超时（${timeoutMs}ms）`, {
        cause: error,
      });
    }
    throw error;
  }
}
