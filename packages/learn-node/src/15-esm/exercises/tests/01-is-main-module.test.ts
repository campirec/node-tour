import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { describe, expect, it } from 'vitest';
import { loadImpl } from '../../../shared/load-impl.js';

const impl = await loadImpl({
  exercise: () => import('../01-is-main-module.js'),
  solution: () => import('../solutions/01-is-main-module.js'),
});

describe('isMainModule', () => {
  it('路径一致时返回 true（含中文与空格）', () => {
    const entry = resolve('scripts', '我的 工具', 'cli.mjs');
    const metaUrl = pathToFileURL(entry).href;

    expect(impl.isMainModule(metaUrl, entry)).toBe(true);
  });

  it('不同路径返回 false', () => {
    const entry = resolve('scripts', 'cli.mjs');
    const metaUrl = pathToFileURL(entry).href;

    expect(impl.isMainModule(metaUrl, resolve('scripts', 'other.mjs'))).toBe(
      false,
    );
  });

  it('argv[1] 缺失时返回 false', () => {
    expect(
      impl.isMainModule(pathToFileURL(resolve('cli.mjs')).href, undefined),
    ).toBe(false);
  });
});
