export class IdempotencyConflictError extends Error {
  constructor(key: string) {
    super(`幂等键 ${key} 对应的请求正在处理中`);
    this.name = 'IdempotencyConflictError';
  }
}

export interface IdempotencyOptions {
  ttlMs?: number;
  maxEntries?: number;
  now?: () => number;
}

export interface IdempotentExecutor {
  run<T>(key: string, fn: () => Promise<T>): Promise<T>;
  size(): number;
}

interface CacheEntry {
  status: 'pending' | 'done';
  value?: unknown;
  createdAt: number;
}

export function createIdempotentExecutor(
  options: IdempotencyOptions = {},
): IdempotentExecutor {
  const ttlMs = options.ttlMs ?? 5 * 60 * 1000;
  const maxEntries = options.maxEntries ?? 10_000;
  const now = options.now ?? Date.now;

  if (!Number.isFinite(ttlMs) || ttlMs <= 0) {
    throw new RangeError('ttlMs 必须是正数');
  }
  if (!Number.isInteger(maxEntries) || maxEntries < 1) {
    throw new RangeError('maxEntries 必须是正整数');
  }

  const cache = new Map<string, CacheEntry>();

  return {
    async run<T>(key: string, fn: () => Promise<T>): Promise<T> {
      if (!key) throw new RangeError('key 不能为空');

      const existing = cache.get(key);
      const current = now();

      if (existing && current - existing.createdAt < ttlMs) {
        if (existing.status === 'pending') {
          throw new IdempotencyConflictError(key);
        }
        return existing.value as T;
      }

      // 淘汰过期或超限条目
      if (cache.size >= maxEntries) {
        const oldest = cache.keys().next().value;
        if (oldest !== undefined) cache.delete(oldest);
      }

      const entry: CacheEntry = { status: 'pending', createdAt: current };
      cache.set(key, entry);

      try {
        const value = await fn();
        entry.status = 'done';
        entry.value = value;
        return value;
      } catch (error) {
        cache.delete(key);
        throw error;
      }
    },

    size(): number {
      return cache.size;
    },
  };
}
