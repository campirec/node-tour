import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { withTempDir } from '../../shared/temp.js';
import { loadImpl } from '../../shared/load-impl.js';

const impl = await loadImpl({
  exercise: () => import('./01-read-utf8.js'),
  solution: () => import('./solutions/01-read-utf8.js'),
});

describe('readUtf8', () => {
  it('读取 UTF-8 文件', async () => {
    await withTempDir(async (dir) => {
      const file = join(dir, 'note.txt');
      await writeFile(file, '你好，Node.js', 'utf8');

      await expect(impl.readUtf8(file)).resolves.toBe('你好，Node.js');
    });
  });

  it('保留 ENOENT 错误码', async () => {
    await withTempDir(async (dir) => {
      await expect(
        impl.readUtf8(join(dir, 'missing.txt')),
      ).rejects.toMatchObject({ code: 'ENOENT' });
    });
  });
});
