import { setTimeout as sleep } from 'node:timers/promises';

export interface RetryOptions {
  retries?: number;
  baseDelayMs?: number;
  signal?: AbortSignal;
}

const RETRYABLE_STATUS = new Set([408, 425, 429, 500, 502, 503, 504]);

export async function fetchWithRetry(
  url: string,
  options: RetryOptions = {},
): Promise<Response> {
  const retries = options.retries ?? 3;
  const baseDelayMs = options.baseDelayMs ?? 200;

  if (!Number.isInteger(retries) || retries < 0) {
    throw new RangeError('retries 必须是 >= 0 的整数');
  }
  if (!Number.isFinite(baseDelayMs) || baseDelayMs < 0) {
    throw new RangeError('baseDelayMs 必须是 >= 0 的数字');
  }

  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    if (options.signal?.aborted) {
      throw options.signal.reason;
    }

    try {
      const response = await fetch(url, { signal: options.signal });
      if (
        !RETRYABLE_STATUS.has(response.status) ||
        attempt === retries
      ) {
        return response;
      }

      await response.body?.cancel();
      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) {
      if (options.signal?.aborted) {
        throw error;
      }
      lastError = error;
      if (attempt === retries) {
        throw error;
      }
    }

    await sleep(baseDelayMs * 2 ** attempt, undefined, {
      signal: options.signal,
    });
  }

  throw lastError instanceof Error
    ? lastError
    : new Error(String(lastError));
}
