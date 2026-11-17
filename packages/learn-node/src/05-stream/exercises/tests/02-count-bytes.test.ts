import { Readable } from 'node:stream';
import { describe, expect, it } from 'vitest';
import { loadImpl } from '../../../shared/load-impl.js';

const impl = await loadImpl({
  exercise: () => import('../02-count-bytes.js'),
  solution: () => import('../solutions/02-count-bytes.js'),
});

describe('countBytes', () => {
  it('按 UTF-8 字节数统计而不是字符数', async () => {
    const readable = Readable.from(['你好', 'abc']);

    await expect(impl.countBytes(readable)).resolves.toBe(9);
  });

  it('空流返回 0', async () => {
    await expect(impl.countBytes(Readable.from([]))).resolves.toBe(0);
  });

  it('上游错误会传递给调用方', async () => {
    const broken = new Readable({
      read() {
        this.destroy(new Error('磁盘读取失败'));
      },
    });

    await expect(impl.countBytes(broken)).rejects.toThrowError('磁盘读取失败');
  });
});
