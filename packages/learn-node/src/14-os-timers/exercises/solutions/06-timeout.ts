import { setTimeout as sleep } from 'node:timers/promises';

export class TimeoutError extends Error {
  readonly timeoutMs: number;

  constructor(timeoutMs: number) {
    super(`操作超时（${timeoutMs}ms）`);
    this.name = 'TimeoutError';
    this.timeoutMs = timeoutMs;
  }
}

export interface TimeoutOptions {
  timeoutMs: number;
  signal?: AbortSignal;
}

export async function withTimeout<T>(
  promise: Promise<T>,
  options: TimeoutOptions,
): Promise<T> {
  const { timeoutMs, signal } = options;
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) {
    throw new RangeError('timeoutMs 必须是正数');
  }

  if (signal?.aborted) {
    throw signal.reason;
  }

  let timer: NodeJS.Timeout | undefined;

  const timeoutPromise = new Promise<never>((_resolve, reject) => {
    timer = setTimeout(() => {
      reject(new TimeoutError(timeoutMs));
    }, timeoutMs);
    timer.unref();
  });

  const abortPromise = signal
    ? new Promise<never>((_resolve, reject) => {
        signal.addEventListener('abort', () => reject(signal.reason), {
          once: true,
        });
      })
    : undefined;

  try {
    return await Promise.race(
      [promise, timeoutPromise, ...(abortPromise ? [abortPromise] : [])],
    );
  } finally {
    if (timer) {
      clearTimeout(timer);
    }
  }
}
