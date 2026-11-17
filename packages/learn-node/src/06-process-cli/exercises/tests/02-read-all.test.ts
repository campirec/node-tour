import { Readable } from 'node:stream';
import { describe, expect, it } from 'vitest';
import { loadImpl } from '../../../shared/load-impl.js';

const impl = await loadImpl({
  exercise: () => import('../02-read-all.js'),
  solution: () => import('../solutions/02-read-all.js'),
});

describe('readAll', () => {
  it('拼接多个 chunk', async () => {
    const stream = Readable.from(['hello', ' ', 'world']);

    await expect(impl.readAll(stream)).resolves.toBe('hello world');
  });

  it('跨 chunk 的中文字符正确解码', async () => {
    const data = Buffer.from('你好，世界', 'utf8');
    const stream = Readable.from([data.subarray(0, 4), data.subarray(4)]);

    await expect(impl.readAll(stream)).resolves.toBe('你好，世界');
  });

  it('空输入返回空字符串', async () => {
    await expect(impl.readAll(Readable.from([]))).resolves.toBe('');
  });

  it('超过 maxBytes 时拒绝', async () => {
    const stream = Readable.from(['12345', '67890']);

    await expect(
      impl.readAll(stream, { maxBytes: 8 }),
    ).rejects.toThrowError('输入超过 8 字节上限');
  });

  it('拒绝非法 maxBytes', async () => {
    await expect(
      impl.readAll(Readable.from([]), { maxBytes: 0 }),
    ).rejects.toBeInstanceOf(RangeError);
  });
});
