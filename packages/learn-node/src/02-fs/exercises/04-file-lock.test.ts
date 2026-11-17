import { access, stat, utimes, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';
import { describe, expect, it } from 'vitest';
import { withTempDir } from '../../shared/temp.js';
import { loadImpl } from '../../shared/load-impl.js';

const impl = await loadImpl({
  exercise: () => import('./04-file-lock.js'),
  solution: () => import('./solutions/04-file-lock.js'),
});

describe('withFileLock', () => {
  it('执行任务并在结束后释放锁', async () => {
    await withTempDir(async (dir) => {
      const lock = join(dir, 'job.lock');
      const result = await impl.withFileLock(lock, async () => {
        const info = await stat(lock);
        expect(info.isFile()).toBe(true);
        return 'done';
      });

      expect(result).toBe('done');
      await expect(access(lock)).rejects.toMatchObject({ code: 'ENOENT' });
    });
  });

  it('并发调用串行执行', async () => {
    await withTempDir(async (dir) => {
      const lock = join(dir, 'job.lock');
      const events: string[] = [];

      await Promise.all([
        impl.withFileLock(
          lock,
          async () => {
            events.push('A:start');
            await sleep(40);
            events.push('A:end');
          },
          { retryMs: 5, timeoutMs: 1000 },
        ),
        (async () => {
          await sleep(5);
          await impl.withFileLock(
            lock,
            async () => {
              events.push('B:start');
              events.push('B:end');
            },
            { retryMs: 5, timeoutMs: 1000 },
          );
        })(),
      ]);

      expect(events).toEqual(['A:start', 'A:end', 'B:start', 'B:end']);
    });
  });

  it('等待超时抛出 LockTimeoutError 且保留他人锁', async () => {
    await withTempDir(async (dir) => {
      const lock = join(dir, 'job.lock');
      await writeFile(lock, 'held by another process');

      await expect(
        impl.withFileLock(lock, async () => 'never', {
          timeoutMs: 30,
          retryMs: 5,
        }),
      ).rejects.toBeInstanceOf(impl.LockTimeoutError);

      await expect(access(lock)).resolves.toBeUndefined();
    });
  });

  it('清理过期残留锁', async () => {
    await withTempDir(async (dir) => {
      const lock = join(dir, 'job.lock');
      await writeFile(lock, 'stale');
      const old = new Date(Date.now() - 60_000);
      await utimes(lock, old, old);

      const result = await impl.withFileLock(
        lock,
        async () => 'acquired',
        { staleMs: 1000, timeoutMs: 500, retryMs: 5 },
      );

      expect(result).toBe('acquired');
      await expect(access(lock)).rejects.toMatchObject({ code: 'ENOENT' });
    });
  });

  it('任务失败后仍释放锁', async () => {
    await withTempDir(async (dir) => {
      const lock = join(dir, 'job.lock');

      await expect(
        impl.withFileLock(lock, async () => {
          throw new Error('job failed');
        }),
      ).rejects.toThrowError('job failed');
      await expect(access(lock)).rejects.toMatchObject({ code: 'ENOENT' });
    });
  });
});
