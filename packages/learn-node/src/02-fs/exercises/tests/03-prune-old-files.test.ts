import { access, mkdir, utimes, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { withTempDir } from '../../../shared/temp.js';
import { loadImpl } from '../../../shared/load-impl.js';

const impl = await loadImpl({
  exercise: () => import('../03-prune-old-files.js'),
  solution: () => import('../solutions/03-prune-old-files.js'),
});

const HOUR = 60 * 60 * 1000;

describe('pruneOldFiles', () => {
  it('删除过期文件并保留新文件', async () => {
    await withTempDir(async (dir) => {
      const now = Date.now();
      const oldFile = join(dir, 'old.log');
      const freshFile = join(dir, 'fresh.log');
      const archive = join(dir, 'archive');

      await writeFile(oldFile, 'old');
      await writeFile(freshFile, 'fresh');
      await mkdir(archive);
      await utimes(oldFile, new Date(now - 2 * HOUR), new Date(now - 2 * HOUR));
      await utimes(archive, new Date(now - 2 * HOUR), new Date(now - 2 * HOUR));

      const result = await impl.pruneOldFiles(dir, now - HOUR);

      expect(result).toEqual({
        removed: ['old.log'],
        kept: ['fresh.log'],
      });
      await expect(access(oldFile)).rejects.toMatchObject({ code: 'ENOENT' });
      await expect(access(freshFile)).resolves.toBeUndefined();
      await expect(access(archive)).resolves.toBeUndefined();
    });
  });

  it('接受 Date 作为 cutoff', async () => {
    await withTempDir(async (dir) => {
      const file = join(dir, 'a.txt');
      await writeFile(file, 'a');
      await utimes(file, new Date(0), new Date(0));

      const result = await impl.pruneOldFiles(dir, new Date(Date.now() - HOUR));

      expect(result.removed).toEqual(['a.txt']);
      expect(result.kept).toEqual([]);
    });
  });

  it('非法 cutoff 抛出 RangeError', async () => {
    await withTempDir(async (dir) => {
      await expect(
        impl.pruneOldFiles(dir, Number.NaN),
      ).rejects.toBeInstanceOf(RangeError);
    });
  });
});
