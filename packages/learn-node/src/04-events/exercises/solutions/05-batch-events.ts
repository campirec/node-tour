import type { EventEmitter } from 'node:events';

export interface BatchOptions<T> {
  maxBatchSize: number;
  maxDelayMs: number;
  onBatch: (items: T[]) => void | Promise<void>;
  onError?: (error: unknown) => void;
}

export interface EventBatcher {
  flush(): Promise<void>;
  dispose(): Promise<void>;
}

export function batchEvents<T = unknown>(
  emitter: EventEmitter,
  event: string,
  options: BatchOptions<T>,
): EventBatcher {
  const { maxBatchSize, maxDelayMs, onBatch, onError } = options;

  if (!Number.isInteger(maxBatchSize) || maxBatchSize < 1) {
    throw new RangeError('maxBatchSize 必须是正整数');
  }
  if (!Number.isFinite(maxDelayMs) || maxDelayMs < 0) {
    throw new RangeError('maxDelayMs 必须是 >= 0 的有限数字');
  }
  if (typeof onBatch !== 'function') {
    throw new TypeError('onBatch 必须是函数');
  }

  let buffer: T[] = [];
  let timer: NodeJS.Timeout | undefined;
  let disposed = false;
  let chain: Promise<void> = Promise.resolve();

  const schedule = (): void => {
    if (disposed || timer) {
      return;
    }
    timer = setTimeout(() => {
      timer = undefined;
      void flush();
    }, maxDelayMs);
  };

  const flush = (): Promise<void> => {
    if (timer) {
      clearTimeout(timer);
      timer = undefined;
    }

    // 在排队前就取走当前缓冲区，保证每次 flush 的批次边界稳定。
    const pending = buffer;
    buffer = [];

    chain = chain.then(async () => {
      for (let offset = 0; offset < pending.length; offset += maxBatchSize) {
        const batch = pending.slice(offset, offset + maxBatchSize);
        try {
          await onBatch(batch);
        } catch (error) {
          onError?.(error);
        }
      }

      if (!disposed && buffer.length > 0) {
        schedule();
      }
    });

    return chain;
  };

  const listener = (value: T): void => {
    buffer.push(value);
    if (buffer.length >= maxBatchSize) {
      void flush();
    } else {
      schedule();
    }
  };

  emitter.on(event, listener);

  return {
    flush,
    async dispose(): Promise<void> {
      if (disposed) {
        return;
      }
      disposed = true;
      emitter.off(event, listener);
      if (timer) {
        clearTimeout(timer);
        timer = undefined;
      }
      await flush();
    },
  };
}
