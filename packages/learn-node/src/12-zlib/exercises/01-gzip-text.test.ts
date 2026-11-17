import { describe, expect, it } from 'vitest';
import { loadImpl } from '../../shared/load-impl.js';

const impl = await loadImpl({
  exercise: () => import('./01-gzip-text.js'),
  solution: () => import('./solutions/01-gzip-text.js'),
});

describe('gzipText', () => {
  it('往返中文文本', async () => {
    const text = 'Node.js 压缩测试 '.repeat(100);
    const compressed = await impl.gzipText(text);

    expect(compressed.subarray(0, 2)).toEqual(Buffer.from([0x1f, 0x8b]));
    await expect(impl.gunzipText(compressed)).resolves.toBe(text);
  });

  it('空字符串也能往返', async () => {
    await expect(impl.gunzipText(await impl.gzipText(''))).resolves.toBe('');
  });

  it('重复内容压缩后更小', async () => {
    const text = 'a'.repeat(10_000);
    const compressed = await impl.gzipText(text);

    expect(compressed.byteLength).toBeLessThan(Buffer.byteLength(text));
  });

  it('非法 gzip 数据会拒绝', async () => {
    await expect(impl.gunzipText(Buffer.from('not gzip'))).rejects.toThrow();
  });
});
