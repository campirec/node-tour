import { describe, expect, it } from 'vitest';
import { loadImpl } from '../../../shared/load-impl.js';

const impl = await loadImpl({
  exercise: () => import('../05-paginate-api.js'),
  solution: () => import('../solutions/05-paginate-api.js'),
});

describe('collectPages', () => {
  it('按游标顺序拼接所有页面', async () => {
    const cursors: Array<string | undefined> = [];
    const pages = [
      { items: [1, 2], nextCursor: 'c2' },
      { items: [3, 4], nextCursor: 'c3' },
      { items: [5], nextCursor: null },
    ];

    const result = await impl.collectPages(async (cursor) => {
      cursors.push(cursor);
      return pages[cursors.length - 1]!;
    });

    expect(result).toEqual([1, 2, 3, 4, 5]);
    expect(cursors).toEqual([undefined, 'c2', 'c3']);
  });

  it('单页没有 nextCursor 时停止', async () => {
    const result = await impl.collectPages(async () => ({ items: ['a'] }));

    expect(result).toEqual(['a']);
  });

  it('检测重复 cursor，避免死循环', async () => {
    let calls = 0;
    await expect(
      impl.collectPages(async () => {
        calls += 1;
        return { items: [calls], nextCursor: 'same' };
      }),
    ).rejects.toThrowError('重复 cursor');
    expect(calls).toBe(2);
  });

  it('超过 maxPages 时抛错', async () => {
    let page = 0;
    await expect(
      impl.collectPages(
        async () => {
          page += 1;
          return { items: [page], nextCursor: `cursor-${page}` };
        },
        { maxPages: 2 },
      ),
    ).rejects.toThrowError('最大页数');
  });

  it('fetchPage 错误向上传播，非法 maxPages 被拒绝', async () => {
    await expect(
      impl.collectPages(async () => {
        throw new Error('network down');
      }),
    ).rejects.toThrowError('network down');

    await expect(
      impl.collectPages(async () => ({ items: [] }), { maxPages: 0 }),
    ).rejects.toBeInstanceOf(RangeError);
  });
});
