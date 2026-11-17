import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { withTempDir } from '../../shared/temp.js';
import { loadImpl } from '../../shared/load-impl.js';

const impl = await loadImpl({
  exercise: () => import('./01-json-store.js'),
  solution: () => import('./solutions/01-json-store.js'),
});

describe('JSON 文件存储', () => {
  it('自动创建父目录并完成读写往返', async () => {
    await withTempDir(async (dir) => {
      const file = join(dir, 'nested', 'config.json');
      const value = { name: 'node-tour', ports: [3000, 3001] };

      await impl.writeJsonAtomic(file, value);

      await expect(impl.readJsonFile(file)).resolves.toEqual(value);
      const text = await readFile(file, 'utf8');
      expect(text.endsWith('\n')).toBe(true);
      expect(await readdir(join(dir, 'nested'))).toEqual(['config.json']);
    });
  });

  it('覆盖已有文件且不遗留临时文件', async () => {
    await withTempDir(async (dir) => {
      const file = join(dir, 'state.json');
      await impl.writeJsonAtomic(file, { version: 1 });
      await impl.writeJsonAtomic(file, { version: 2 });

      await expect(impl.readJsonFile(file)).resolves.toEqual({ version: 2 });
      expect(await readdir(dir)).toEqual(['state.json']);
    });
  });

  it('JSON 非法时给出文件路径', async () => {
    await withTempDir(async (dir) => {
      const file = join(dir, 'broken.json');
      await writeFile(file, '{ not json', 'utf8');

      await expect(impl.readJsonFile(file)).rejects.toThrowError(
        `JSON 解析失败：${file}`,
      );
    });
  });

  it('文件不存在时保留原始 ENOENT 错误', async () => {
    await withTempDir(async (dir) => {
      await expect(
        impl.readJsonFile(join(dir, 'missing.json')),
      ).rejects.toMatchObject({ code: 'ENOENT' });
    });
  });
});
