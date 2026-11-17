import { describe, expect, it } from 'vitest';
import { loadImpl } from '../../shared/load-impl.js';

const impl = await loadImpl({
  exercise: () => import('./05-pagination-links.js'),
  solution: () => import('./solutions/05-pagination-links.js'),
});

function params(link: string): Record<string, string> {
  return Object.fromEntries(new URL(link).searchParams.entries());
}

describe('buildPaginationLinks', () => {
  it('保留筛选参数并生成前后页链接', () => {
    const links = impl.buildPaginationLinks(
      'https://api.test/v1/tasks?status=todo',
      2,
      10,
      45,
    );

    expect(params(links.self)).toEqual({
      status: 'todo',
      page: '2',
      pageSize: '10',
    });
    expect(params(links.prev!).page).toBe('1');
    expect(params(links.next!).page).toBe('3');
    expect(params(links.first).page).toBe('1');
    expect(params(links.last).page).toBe('5');
  });

  it('第一页没有 prev，最后一页没有 next', () => {
    const first = impl.buildPaginationLinks('https://api.test/items', 1, 10, 45);
    const last = impl.buildPaginationLinks('https://api.test/items', 5, 10, 45);

    expect(first.prev).toBeNull();
    expect(first.next).not.toBeNull();
    expect(last.next).toBeNull();
    expect(last.prev).not.toBeNull();
  });

  it('total=0 时生成单页', () => {
    const links = impl.buildPaginationLinks('https://api.test/items', 1, 20, 0);

    expect(params(links.self)).toEqual({ page: '1', pageSize: '20' });
    expect(params(links.last).page).toBe('1');
    expect(links.prev).toBeNull();
    expect(links.next).toBeNull();
  });

  it('页码越界时按最后一页生成 self', () => {
    const links = impl.buildPaginationLinks('https://api.test/items', 99, 10, 45);

    expect(params(links.self).page).toBe('5');
    expect(links.next).toBeNull();
  });

  it('拒绝非法参数与非法 URL', () => {
    expect(() =>
      impl.buildPaginationLinks('https://api.test/items', 0, 10, 45),
    ).toThrowError(RangeError);
    expect(() =>
      impl.buildPaginationLinks('https://api.test/items', 1, 0, 45),
    ).toThrowError(RangeError);
    expect(() =>
      impl.buildPaginationLinks('https://api.test/items', 1, 10, -1),
    ).toThrowError(RangeError);
    expect(() =>
      impl.buildPaginationLinks('/relative', 1, 10, 45),
    ).toThrowError(TypeError);
  });
});
