import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { withTempDir } from '../../shared/temp.js';
import { loadImpl } from '../../shared/load-impl.js';

const impl = await loadImpl({
  exercise: () => import('./02-list-files.js'),
  solution: () => import('./solutions/02-list-files.js'),
});

describe('listFilesRecursive', () => {
  it('返回排序后的相对路径并统一分隔符', async () => {
    await withTempDir(async (dir) => {
      await mkdir(join(dir, 'src', 'nested'), { recursive: true });
      await mkdir(join(dir, 'empty'), { recursive: true });
      await writeFile(join(dir, 'README.md'), '');
      await writeFile(join(dir, 'src', 'index.ts'), '');
      await writeFile(join(dir, 'src', 'nested', 'util.ts'), '');

      await expect(impl.listFilesRecursive(dir)).resolves.toEqual([
        'README.md',
        'src/index.ts',
        'src/nested/util.ts',
      ]);
    });
  });

  it('空目录返回空数组', async () => {
    await withTempDir(async (dir) => {
      await expect(impl.listFilesRecursive(dir)).resolves.toEqual([]);
    });
  });

  it('目录不存在时抛出 ENOENT', async () => {
    await withTempDir(async (dir) => {
      await expect(
        impl.listFilesRecursive(join(dir, 'missing')),
      ).rejects.toMatchObject({ code: 'ENOENT' });
    });
  });
});
