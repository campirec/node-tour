import { describe, expect, it } from 'vitest';
import { loadImpl } from '../../../shared/load-impl.js';

const impl = await loadImpl({
  exercise: () => import('../02-with-cache-bust.js'),
  solution: () => import('../solutions/02-with-cache-bust.js'),
});

describe('withCacheBust', () => {
  it('保留原有 query 与 hash', () => {
    expect(
      impl.withCacheBust('https://cdn.test/plugin.mjs?debug=1#main', 2),
    ).toBe('https://cdn.test/plugin.mjs?debug=1&v=2#main');
  });

  it('重复调用替换 v 而不是追加', () => {
    const once = impl.withCacheBust('https://cdn.test/plugin.mjs', 1);
    const twice = impl.withCacheBust(once, 2);

    expect(twice).toBe('https://cdn.test/plugin.mjs?v=2');
  });

  it('对特殊字符编码', () => {
    expect(
      impl.withCacheBust('file:///tmp/我的 插件.mjs', '版本 1'),
    ).toContain('v=%E7%89%88%E6%9C%AC+1');
  });

  it('空版本与非法 URL 被拒绝', () => {
    expect(() => impl.withCacheBust('https://cdn.test/a.mjs', '')).toThrowError(
      RangeError,
    );
    expect(() => impl.withCacheBust('/relative', 1)).toThrowError(TypeError);
  });
});
