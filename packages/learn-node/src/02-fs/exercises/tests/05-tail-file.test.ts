import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { withTempDir } from '../../../shared/temp.js';
import { loadImpl } from '../../../shared/load-impl.js';

const impl = await loadImpl({
  exercise: () => import('../05-tail-file.js'),
  solution: () => import('../solutions/05-tail-file.js'),
});

describe('readLastLines', () => {
  it('返回最后 N 行并保持顺序', async () => {
    await withTempDir(async (dir) => {
      const file = join(dir, 'app.log');
      const lines = Array.from({ length: 100 }, (_, i) => `line-${i + 1}`);
      await writeFile(file, `${lines.join('\n')}\n`, 'utf8');

      await expect(impl.readLastLines(file, 3)).resolves.toEqual([
        'line-98',
        'line-99',
        'line-100',
      ]);
    });
  });

  it('支持无末尾换行与 CRLF', async () => {
    await withTempDir(async (dir) => {
      const file = join(dir, 'app.log');
      await writeFile(file, 'a\r\nb\r\nc', 'utf8');

      await expect(impl.readLastLines(file, 2)).resolves.toEqual(['b', 'c']);
    });
  });

  it('文件小于窗口或行数不足时返回全部内容', async () => {
    await withTempDir(async (dir) => {
      const file = join(dir, 'small.log');
      await writeFile(file, 'one\ntwo\n', 'utf8');

      await expect(impl.readLastLines(file, 10)).resolves.toEqual([
        'one',
        'two',
      ]);
    });
  });

  it('按字节窗口读取时不返回截断的半行', async () => {
    await withTempDir(async (dir) => {
      const file = join(dir, 'wide.log');
      await writeFile(
        file,
        `${'x'.repeat(200)}\nlast-second\nlast-line\n`,
        'utf8',
      );

      await expect(
        impl.readLastLines(file, 10, 20),
      ).resolves.toEqual(['last-line']);
    });
  });

  it('拒绝非法参数与不存在的文件', async () => {
    await withTempDir(async (dir) => {
      const file = join(dir, 'app.log');
      await writeFile(file, 'a\n');

      await expect(impl.readLastLines(file, 0)).rejects.toBeInstanceOf(
        RangeError,
      );
      await expect(
        impl.readLastLines(file, 1, 0),
      ).rejects.toBeInstanceOf(RangeError);
      await expect(
        impl.readLastLines(join(dir, 'missing.log'), 1),
      ).rejects.toMatchObject({ code: 'ENOENT' });
    });
  });
});
