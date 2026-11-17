import { gzip } from 'node:zlib';
import { promisify } from 'node:util';
import { describe, expect, it } from 'vitest';
import { loadImpl } from '../../shared/load-impl.js';

const impl = await loadImpl({
  exercise: () => import('./05-jsonl-gzip.js'),
  solution: () => import('./solutions/05-jsonl-gzip.js'),
});

const gzipAsync = promisify(gzip);

describe('JSON Lines gzip', () => {
  it('往返对象数组', async () => {
    const records = [
      { id: 1, name: '张三', active: true },
      { id: 2, name: '李四', active: false },
    ];

    const compressed = await impl.gzipJsonLines(records);

    expect(compressed.subarray(0, 2)).toEqual(Buffer.from([0x1f, 0x8b]));
    await expect(impl.gunzipJsonLines(compressed)).resolves.toEqual(records);
  });

  it('空数组往返为空数组', async () => {
    const compressed = await impl.gzipJsonLines([]);
    await expect(impl.gunzipJsonLines(compressed)).resolves.toEqual([]);
  });

  it('跳过空行', async () => {
    const compressed = await gzipAsync(Buffer.from('{"a":1}\n\n{"a":2}\n'));

    await expect(impl.gunzipJsonLines(compressed)).resolves.toEqual([
      { a: 1 },
      { a: 2 },
    ]);
  });

  it('非法行错误包含行号与 cause', async () => {
    const compressed = await gzipAsync(
      Buffer.from('{"ok":true}\nnot-json\n'),
    );

    await expect(impl.gunzipJsonLines(compressed)).rejects.toMatchObject({
      message: expect.stringContaining('第 2 行'),
      cause: expect.any(SyntaxError),
    });
  });

  it('拒绝无法序列化或非法 gzip', async () => {
    await expect(
      impl.gzipJsonLines([undefined]),
    ).rejects.toBeInstanceOf(TypeError);
    await expect(
      impl.gunzipJsonLines(Buffer.from('not gzip')),
    ).rejects.toThrow();
  });
});
