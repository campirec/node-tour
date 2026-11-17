import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { withTempDir } from '../../shared/temp.js';
import { loadImpl } from '../../shared/load-impl.js';

const impl = await loadImpl({
  exercise: () => import('./04-run-with-retry.js'),
  solution: () => import('./solutions/04-run-with-retry.js'),
});

const fixture = (name: string): string =>
  fileURLToPath(new URL(`../fixtures/${name}`, import.meta.url));

describe('runCommandWithRetry', () => {
  it('失败两次后第三次成功', async () => {
    await withTempDir(async (dir) => {
      const counter = join(dir, 'attempts.txt');
      const result = await impl.runCommandWithRetry(
        process.execPath,
        [fixture('flaky.mjs'), counter, '3'],
        { retries: 3, baseDelayMs: 1 },
      );

      expect(result.stdout).toBe('attempt 3 ok\n');
      await expect(readFile(counter, 'utf8')).resolves.toBe('3');
    });
  });

  it('用尽重试后抛 CommandRetryError', async () => {
    await expect(
      impl.runCommandWithRetry(process.execPath, [fixture('fail.mjs')], {
        retries: 2,
        baseDelayMs: 1,
      }),
    ).rejects.toMatchObject({
      name: 'CommandRetryError',
      attempts: 3,
      exitCode: 3,
      stderr: 'boom\n',
    });
  });

  it('AbortSignal 中止后不再重试', async () => {
    const controller = new AbortController();
    const promise = impl.runCommandWithRetry(
      process.execPath,
      [fixture('sleep.mjs')],
      { retries: 5, baseDelayMs: 1, signal: controller.signal },
    );
    setTimeout(() => controller.abort(), 30);

    await expect(promise).rejects.toMatchObject({ name: 'AbortError' });
  });

  it('拒绝非法 retries', async () => {
    await expect(
      impl.runCommandWithRetry(process.execPath, ['-e', 'process.exit(0)'], {
        retries: -1,
      }),
    ).rejects.toBeInstanceOf(RangeError);
  });
});
