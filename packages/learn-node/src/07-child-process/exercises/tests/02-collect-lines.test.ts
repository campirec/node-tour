import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { loadImpl } from '../../../shared/load-impl.js';

const impl = await loadImpl({
  exercise: () => import('../02-collect-lines.js'),
  solution: () => import('../solutions/02-collect-lines.js'),
});

const fixture = (name: string): string =>
  fileURLToPath(new URL(`../../fixtures/${name}`, import.meta.url));

describe('collectLines', () => {
  it('跨时间片输出仍能正确按行收集', async () => {
    const lines = await impl.collectLines(process.execPath, [
      fixture('print-lines.mjs'),
    ]);

    expect(lines).toEqual(['第一行', '第二行', '第三行']);
  });

  it('把输入写入子进程 stdin', async () => {
    const lines = await impl.collectLines(
      process.execPath,
      [fixture('echo-stdin.mjs')],
      'hello\nworld',
    );

    expect(lines).toEqual(['HELLO', 'WORLD']);
  });

  it('非零退出码包含 stderr', async () => {
    await expect(
      impl.collectLines(process.execPath, [fixture('fail.mjs')]),
    ).rejects.toThrowError(/boom/);
  });
});
