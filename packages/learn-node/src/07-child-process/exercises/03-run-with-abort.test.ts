import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { loadImpl } from '../../shared/load-impl.js';

const impl = await loadImpl({
  exercise: () => import('./03-run-with-abort.js'),
  solution: () => import('./solutions/03-run-with-abort.js'),
});

const fixture = (name: string): string =>
  fileURLToPath(new URL(`../fixtures/${name}`, import.meta.url));

describe('runWithAbort', () => {
  it('正常退出返回输出', async () => {
    const controller = new AbortController();
    const result = await impl.runWithAbort(
      process.execPath,
      ['-e', 'console.log("ok")'],
      controller.signal,
    );

    expect(result).toEqual({ stdout: 'ok\n', stderr: '' });
  });

  it('中止后杀掉长时间运行的子进程', async () => {
    const controller = new AbortController();
    const promise = impl.runWithAbort(
      process.execPath,
      [fixture('sleep.mjs')],
      controller.signal,
    );
    setTimeout(() => controller.abort(), 30);

    await expect(promise).rejects.toThrowError('命令已取消');
  });

  it('已经中止的 signal 不会启动进程', async () => {
    const controller = new AbortController();
    controller.abort();

    await expect(
      impl.runWithAbort(process.execPath, ['-e', 'process.exit(1)'], controller.signal),
    ).rejects.toThrowError('命令已取消');
  });
});
