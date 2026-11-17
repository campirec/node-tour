/**
 * 企业级练习：加载并校验插件模块。
 *
 * 场景：后台可扩展任务、数据源适配器、报表导出器。
 *
 * 要求：
 * - 默认通过动态 import(specifier) 加载；
 * - 优先使用 default 导出，没有 default 时使用模块命名空间；
 * - 插件必须是 { name: 非空字符串, setup: 函数 }；
 * - 加载失败或结构非法时抛 Error，并保留 cause；
 * - 支持注入 importer，便于测试与自定义解析；
 * - 注意：插件代码拥有当前进程权限，只加载可信来源。
 */
export interface Plugin {
  name: string;
  setup(context: unknown): unknown | Promise<unknown>;
}

export type PluginImporter = (specifier: string) => Promise<unknown>;

export interface LoadPluginOptions {
  importer?: PluginImporter;
}

export function isPlugin(value: unknown): value is Plugin {
  // TODO
  throw new Error('TODO: isPlugin');
}

export async function loadPlugin(
  specifier: string,
  options: LoadPluginOptions = {},
): Promise<Plugin> {
  // TODO
  throw new Error('TODO: loadPlugin');
}
