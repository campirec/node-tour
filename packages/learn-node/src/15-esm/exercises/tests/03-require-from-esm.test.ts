import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { describe, expect, it } from 'vitest';
import { withTempDir } from '../../../shared/temp.js';
import { loadImpl } from '../../../shared/load-impl.js';

const impl = await loadImpl({
  exercise: () => import('../03-require-from-esm.js'),
  solution: () => import('../solutions/03-require-from-esm.js'),
});

describe('requireFromEsm', () => {
  it('加载 CommonJS 文件', async () => {
    await withTempDir(async (dir) => {
      const legacyFile = join(dir, 'legacy.cjs');
      await writeFile(
        legacyFile,
        "module.exports = { answer: 42, name: 'legacy' };",
        'utf8',
      );
      const metaUrl = pathToFileURL(join(dir, 'entry.mjs')).href;

      const result = impl.requireFromEsm<{
        answer: number;
        name: string;
      }>(metaUrl, legacyFile);

      expect(result).toEqual({ answer: 42, name: 'legacy' });
    });
  });

  it('加载 Node 内置模块', () => {
    const path = impl.requireFromEsm<typeof import('node:path')>(
      import.meta.url,
      'node:path',
    );

    expect(typeof path.join).toBe('function');
    expect(path.join('a', 'b')).toContain('a');
  });
});
