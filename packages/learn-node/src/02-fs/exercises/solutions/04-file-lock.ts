import { open, stat, unlink, type FileHandle } from 'node:fs/promises';
import { setTimeout as sleep } from 'node:timers/promises';

export class LockTimeoutError extends Error {
  constructor(lockPath: string, timeoutMs: number) {
    super(`获取文件锁超时（${timeoutMs}ms）：${lockPath}`);
    this.name = 'LockTimeoutError';
  }
}

export interface FileLockOptions {
  timeoutMs?: number;
  retryMs?: number;
  staleMs?: number;
}

export async function withFileLock<T>(
  lockPath: string,
  fn: () => Promise<T>,
  options: FileLockOptions = {},
): Promise<T> {
  const timeoutMs = options.timeoutMs ?? 5000;
  const retryMs = options.retryMs ?? 25;
  const staleMs = options.staleMs ?? 30_000;

  if (!Number.isFinite(timeoutMs) || timeoutMs < 0) {
    throw new RangeError('timeoutMs 必须是 >= 0 的数字');
  }
  if (!Number.isFinite(retryMs) || retryMs <= 0) {
    throw new RangeError('retryMs 必须是 > 0 的数字');
  }
  if (!Number.isFinite(staleMs) || staleMs < 0) {
    throw new RangeError('staleMs 必须是 >= 0 的数字');
  }

  const startedAt = Date.now();
  let handle: FileHandle | undefined;

  for (;;) {
    try {
      handle = await open(lockPath, 'wx');
      break;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'EEXIST') {
        throw error;
      }

      try {
        const info = await stat(lockPath);
        if (staleMs > 0 && Date.now() - info.mtimeMs > staleMs) {
          await unlink(lockPath).catch((unlinkError: NodeJS.ErrnoException) => {
            if (unlinkError.code !== 'ENOENT') {
              throw unlinkError;
            }
          });
          continue;
        }
      } catch (statError) {
        if ((statError as NodeJS.ErrnoException).code !== 'ENOENT') {
          throw statError;
        }
        continue;
      }

      if (Date.now() - startedAt >= timeoutMs) {
        throw new LockTimeoutError(lockPath, timeoutMs);
      }
      await sleep(retryMs);
    }
  }

  try {
    await handle.writeFile(
      JSON.stringify({
        pid: process.pid,
        createdAt: new Date().toISOString(),
      }),
      'utf8',
    );
    return await fn();
  } finally {
    await handle.close().catch(() => undefined);
    await unlink(lockPath).catch(() => undefined);
  }
}
