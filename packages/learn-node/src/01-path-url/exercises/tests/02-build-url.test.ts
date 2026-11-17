import { describe, expect, it } from 'vitest';
import { loadImpl } from '../../../shared/load-impl.js';

const impl = await loadImpl({
  exercise: () => import('../02-build-url.js'),
  solution: () => import('../solutions/02-build-url.js'),
});

describe('buildUrl', () => {
  it('保留已有查询参数并按顺序追加', () => {
    const url = impl.buildUrl('https://api.test/v1/tasks?debug=1', {
      status: 'done',
      page: 2,
      tag: ['a', 'b'],
    });

    expect(url).toBe(
      'https://api.test/v1/tasks?debug=1&status=done&page=2&tag=a&tag=b',
    );
  });

  it('正确编码空格、中文与特殊字符', () => {
    const url = impl.buildUrl('https://api.test/search', {
      q: 'Node.js 入门',
      'x-trace': 'a&b=c',
    });

    expect(url).toBe(
      'https://api.test/search?q=Node.js+%E5%85%A5%E9%97%A8&x-trace=a%26b%3Dc',
    );
  });

  it('跳过 null/undefined，保留 false 与 0', () => {
    const url = impl.buildUrl('https://api.test/items', {
      empty: null,
      missing: undefined,
      enabled: false,
      offset: 0,
    });

    expect(url).toBe('https://api.test/items?enabled=false&offset=0');
  });

  it('保留 hash，并拒绝非法 baseUrl', () => {
    expect(
      impl.buildUrl('https://api.test/a#section', { page: 3 }),
    ).toBe('https://api.test/a?page=3#section');
    expect(() => impl.buildUrl('/relative', {})).toThrowError(TypeError);
  });
});
