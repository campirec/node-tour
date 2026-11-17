import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { describe, expect, it } from 'vitest';
import { loadImpl } from '../../shared/load-impl.js';

const impl = await loadImpl({
  exercise: () => import('./01-resolve-module-path.js'),
  solution: () => import('./solutions/01-resolve-module-path.js'),
});

describe('resolveFromImportMeta', () => {
  it('以模块文件所在目录为基准解析相对路径', () => {
    const modulePath = resolve('fixtures', 'nested', 'module.mjs');
    const metaUrl = pathToFileURL(modulePath).href;

    expect(
      impl.resolveFromImportMeta(metaUrl, '../assets/data.json'),
    ).toBe(resolve('fixtures', 'assets', 'data.json'));
  });

  it('正确处理空格与中文路径', () => {
    const modulePath = resolve('fixtures', '我的 应用', 'module.mjs');
    const metaUrl = pathToFileURL(modulePath).href;

    expect(impl.resolveFromImportMeta(metaUrl, './模板.txt')).toBe(
      resolve('fixtures', '我的 应用', '模板.txt'),
    );
  });

  it('绝对路径原样保留，不使用模块目录', () => {
    const modulePath = resolve('fixtures', 'module.mjs');
    const metaUrl = pathToFileURL(modulePath).href;
    const absolute = resolve('其它位置', 'config.json');

    expect(impl.resolveFromImportMeta(metaUrl, absolute)).toBe(absolute);
    expect(
      impl.resolveFromImportMeta(metaUrl, 'template.html'),
    ).toBe(resolve(dirname(fileURLToPath(metaUrl)), 'template.html'));
  });
});
