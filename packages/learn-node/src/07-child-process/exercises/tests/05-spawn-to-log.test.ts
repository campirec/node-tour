import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { withTempDir } from '../../../shared/temp.js';
import { loadImpl } from '../../../shared/load-impl.js';

const impl = await loadImpl({
  exercise: () => import('../05-spawn-to-log.js'),
  solution: () => import('../solutions/05-spawn-to-log.js'),
});

const fixture = (name: string): string =>
  fileURLToPath(new URL(`../../fixtures/${name}`, import.meta.url));

describe('runToLog', () => {
  it('把 stdout/stderr 写入嵌套目录的日志', async () => {
    await withTempDir(async (dir) => {
      const logPath = join(dir, 'logs', 'deploy.log');
      const result = await impl.runToLog(
        process.execPath,
        [fixture('print-lines.mjs')],
        { logPath },
      );

      expect(result).toEqual({ exitCode: 0, logPath });
      const log = await readFile(logPath, 'utf8');
      expect(log).toContain('第一行');
      expect(log).toContain('第三行');
    });
  });

  it('非零退出码保留日志并返回实际 exitCode', async () => {
    await withTempDir(async (dir) => {
      const logPath = join(dir, 'fail.log');
      const result = await impl.runToLog(
        process.execPath,
        [fixture('fail.mjs')],
        { logPath },
      );

      expect(result.exitCode).toBe(3);
      await expect(readFile(logPath, 'utf8')).resolves.toContain('boom');
    });
  });

  it('超时终止进程并拒绝', async () => {
    await withTempDir(async (dir) => {
      await expect(
        impl.runToLog(process.execPath, [fixture('sleep.mjs')], {
          logPath: join(dir, 'timeout.log'),
          timeoutMs: 30,
        }),
      ).rejects.toThrowError('超时');
    });
  });

  it('启动失败时拒绝', async () => {
    await withTempDir(async (dir) => {
      await expect(
        impl.runToLog('definitely-not-a-command', [], {
          logPath: join(dir, 'missing.log'),
        }),
      ).rejects.toMatchObject({ code: 'ENOENT' });
    });
  });
});
