import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { loadImpl } from '../../shared/load-impl.js';

const impl = await loadImpl({
  exercise: () => import('./01-run-command.js'),
  solution: () => import('./solutions/01-run-command.js'),
});

const fixture = (name: string): string =>
  fileURLToPath(new URL(`../fixtures/${name}`, import.meta.url));

describe('runCommand', () => {
  it('返回 stdout 与 stderr', async () => {
    const result = await impl.runCommand(process.execPath, [
      '-e',
      'console.log("你好"); console.error("warn")',
    ]);

    expect(result).toEqual({ stdout: '你好\n', stderr: 'warn\n' });
  });

  it('非零退出码转换为 CommandError', async () => {
    await expect(
      impl.runCommand(process.execPath, [fixture('fail.mjs')]),
    ).rejects.toMatchObject({
      name: 'CommandError',
      exitCode: 3,
      stderr: 'boom\n',
    });
  });

  it('超时会终止子进程', async () => {
    await expect(
      impl.runCommand(process.execPath, [fixture('sleep.mjs')], {
        timeoutMs: 50,
      }),
    ).rejects.toMatchObject({ name: 'CommandError' });
  });

  it('超过 maxBuffer 时失败', async () => {
    await expect(
      impl.runCommand(
        process.execPath,
        ['-e', 'process.stdout.write("x".repeat(10000))'],
        { maxBuffer: 1000 },
      ),
    ).rejects.toMatchObject({ name: 'CommandError' });
  });
});
