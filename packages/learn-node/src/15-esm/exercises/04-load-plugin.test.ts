import { describe, expect, it } from 'vitest';
import { loadImpl } from '../../shared/load-impl.js';

const impl = await loadImpl({
  exercise: () => import('./04-load-plugin.js'),
  solution: () => import('./solutions/04-load-plugin.js'),
});

describe('loadPlugin', () => {
  it('动态加载 fixture 插件并执行 setup', async () => {
    const plugin = await impl.loadPlugin(
      new URL('../fixtures/plugin.mjs', import.meta.url).href,
    );

    expect(plugin.name).toBe('fixture-plugin');
    const result = await plugin.setup({ tenant: 'acme' });
    expect(result).toEqual({
      ok: true,
      context: { tenant: 'acme' },
    });
  });

  it('支持注入 importer，并优先 default 导出', async () => {
    const plugin = await impl.loadPlugin('virtual:plugin', {
      importer: async () => ({
        default: {
          name: 'virtual',
          setup: () => 'ready',
        },
        named: 'ignored',
      }),
    });

    expect(plugin.name).toBe('virtual');
    await expect(Promise.resolve(plugin.setup({}))).resolves.toBe('ready');
  });

  it('没有 default 时使用模块命名空间', async () => {
    const plugin = await impl.loadPlugin('virtual:named', {
      importer: async () => ({
        name: 'named-plugin',
        setup: () => 'ok',
      }),
    });

    expect(plugin.name).toBe('named-plugin');
  });

  it('结构非法时拒绝并保留 cause', async () => {
    await expect(
      impl.loadPlugin('virtual:bad', {
        importer: async () => ({ default: { name: '', setup: 'nope' } }),
      }),
    ).rejects.toThrowError('插件必须导出');

    const cause = new Error('module exploded');
    await expect(
      impl.loadPlugin('virtual:throw', {
        importer: async () => {
          throw cause;
        },
      }),
    ).rejects.toMatchObject({
      message: expect.stringContaining('插件加载失败'),
      cause,
    });
  });

  it('isPlugin 做结构校验', () => {
    expect(impl.isPlugin({ name: 'a', setup: () => undefined })).toBe(true);
    expect(impl.isPlugin({ name: 'a', setup: 1 })).toBe(false);
    expect(impl.isPlugin(null)).toBe(false);
  });
});
