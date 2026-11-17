import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { readFileTool } from '../src/tools/read-file.js';

let dir: string;

beforeEach(async () => {
  dir = await mkdtemp(join(tmpdir(), 'node-tour-agent-'));
});

afterEach(async () => {
  await rm(dir, { recursive: true, force: true });
});

describe('readFileTool', () => {
  it('读取工作目录内的文本文件', async () => {
    await writeFile(join(dir, 'note.txt'), '你好，Agent', 'utf8');

    const result = await readFileTool.execute(
      { path: 'note.txt' },
      { cwd: dir },
    );

    expect(result).toMatchObject({
      path: 'note.txt',
      bytes: 14,
      content: '你好，Agent',
      truncated: false,
    });
  });

  it('按 maxBytes 截断内容', async () => {
    await writeFile(join(dir, 'data.txt'), 'abcdef', 'utf8');

    const result = await readFileTool.execute(
      { path: 'data.txt', maxBytes: 3 },
      { cwd: dir },
    );

    expect(result).toMatchObject({
      content: 'abc',
      truncated: true,
      bytes: 6,
    });
  });

  it('拒绝目录穿越', async () => {
    const secret = join(dirname(dir), `secret-${randomUUID()}.txt`);
    await writeFile(secret, 'secret', 'utf8');

    try {
      await expect(
        readFileTool.execute(
          { path: `../${secret.split(/[\\/]/).at(-1)}` },
          { cwd: dir },
        ),
      ).rejects.toThrowError('拒绝访问工作目录之外的路径');
    } finally {
      await rm(secret, { force: true });
    }
  });

  it('拒绝目录与非文件目标', async () => {
    await expect(
      readFileTool.execute({ path: '.' }, { cwd: dir }),
    ).rejects.toThrowError('目标不是普通文件');
    await expect(
      readFileTool.execute({ path: 'missing.txt' }, { cwd: dir }),
    ).rejects.toThrowError();
  });
});
