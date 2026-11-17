import { mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { gunzip } from 'node:zlib';
import { promisify } from 'node:util';
import { describe, expect, it } from 'vitest';
import { withTempDir } from '../../shared/temp.js';
import { loadImpl } from '../../shared/load-impl.js';

const impl = await loadImpl({
  exercise: () => import('./04-gzip-file.js'),
  solution: () => import('./solutions/04-gzip-file.js'),
});

const gunzipAsync = promisify(gunzip);

describe('gzipFileAtomic', () => {
  it('默认生成 .gz，内容可还原且不遗留临时文件', async () => {
    await withTempDir(async (dir) => {
      const source = join(dir, 'app.log');
      const text = '2026-01-01 INFO hello\n'.repeat(1000);
      await writeFile(source, text, 'utf8');

      const result = await impl.gzipFileAtomic(source);

      expect(result.targetPath).toBe(`${source}.gz`);
      expect(result.originalBytes).toBe(Buffer.byteLength(text));
      expect(result.compressedBytes).toBeLessThan(result.originalBytes);
      const restored = await gunzipAsync(await readFile(result.targetPath));
      expect(restored.toString('utf8')).toBe(text);

      const files = await readdir(dir);
      expect(files.sort()).toEqual(['app.log', 'app.log.gz']);
    });
  });

  it('支持自定义目标目录并覆盖已有文件', async () => {
    await withTempDir(async (dir) => {
      const source = join(dir, 'data.json');
      const target = join(dir, 'archive', 'data.json.gz');
      await writeFile(source, '{"version":2}', 'utf8');
      await mkdir(join(dir, 'archive'));
      await writeFile(target, 'old', 'utf8');

      const result = await impl.gzipFileAtomic(source, target);

      expect(result.targetPath).toBe(target);
      const restored = await gunzipAsync(await readFile(target));
      expect(restored.toString('utf8')).toBe('{"version":2}');
    });
  });

  it('源文件不存在时拒绝且不创建目标', async () => {
    await withTempDir(async (dir) => {
      const target = join(dir, 'missing.gz');

      await expect(
        impl.gzipFileAtomic(join(dir, 'missing.log'), target),
      ).rejects.toMatchObject({ code: 'ENOENT' });
      await expect(stat(target)).rejects.toMatchObject({ code: 'ENOENT' });
    });
  });
});
