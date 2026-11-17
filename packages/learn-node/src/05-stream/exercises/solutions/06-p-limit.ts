import { setTimeout as sleep } from 'node:timers/promises';

export interface LimitOptions {
  signal?: AbortSignal;
}

export type AsyncTask<T> = () => Promise<T>;

export function pLimit(concurrency: number): <T>(fn: AsyncTask<T>, options?: LimitOptions) => Promise<T> {
  if (!Number.isInteger(concurrency) || concurrency < 1) {
    throw new RangeError('concurrency 必须是正整数');
  }

  let running = 0;
  const queue: Array<{
    fn: AsyncTask<unknown>;
    resolve: (value: unknown) => void;
    reject: (reason: unknown) => void;
    signal?: AbortSignal;
  }> = [];

  const next = (): void => {
    while (running < concurrency && queue.length > 0) {
      const item = queue.shift();
      if (!item) break;

      if (item.signal?.aborted) {
        item.reject(item.signal.reason);
        continue;
      }

      running += 1;
      item.fn()
        .then(item.resolve, item.reject)
        .finally(() => {
          running -= 1;
          next();
        });
    }
  };

  return <T>(fn: AsyncTask<T>, options: LimitOptions = {}): Promise<T> => {
    if (options.signal?.aborted) {
      return Promise.reject(options.signal.reason);
    }

    return new Promise<T>((resolve, reject) => {
      queue.push({
        fn: fn as AsyncTask<unknown>,
        resolve: resolve as (value: unknown) => void,
        reject,
        signal: options.signal,
      });
      next();
    });
  };
}
