import { setTimeout as sleep } from 'node:timers/promises';

export interface RetryOptions {
  retries?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
  jitter?: boolean;
  signal?: AbortSignal;
  shouldRetry?: (error: unknown, attempt: number) => boolean;
}

export async function withRetry<T>(
  fn: (attempt: number) => Promise<T> | T,
  options: RetryOptions = {},
): Promise<T> {
  const retries = options.retries ?? 3;
  const baseDelayMs = options.baseDelayMs ?? 100;
  const maxDelayMs = options.maxDelayMs ?? 30_000;
  const jitter = options.jitter ?? false;

  if (!Number.isInteger(retries) || retries < 0) {
    throw new RangeError('retries 必须是 >= 0 的整数');
  }
  if (!Number.isFinite(baseDelayMs) || baseDelayMs < 0) {
    throw new RangeError('baseDelayMs 必须是 >= 0 的数字');
  }
  if (!Number.isFinite(maxDelayMs) || maxDelayMs < 0) {
    throw new RangeError('maxDelayMs 必须是 >= 0 的数字');
  }

  let lastError: unknown;

  for (let attempt = 1; attempt <= retries + 1; attempt += 1) {
    if (options.signal?.aborted) {
      throw options.signal.reason;
    }

    try {
      return await fn(attempt);
    } catch (error) {
      lastError = error;
      if (attempt > retries) {
        break;
      }
      if (options.shouldRetry && !options.shouldRetry(error, attempt)) {
        break;
      }

      const exponential = Math.min(
        maxDelayMs,
        baseDelayMs * 2 ** (attempt - 1),
      );
      const delay = jitter
        ? Math.floor(Math.random() * exponential)
        : exponential;
      await sleep(delay, undefined, options.signal ? { signal: options.signal } : undefined);
    }
  }

  throw lastError;
}
