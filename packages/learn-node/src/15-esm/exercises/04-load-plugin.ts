/**
 * 企业级练习：加载并校验插件模块
 *
 * 场景：后台可扩展任务、数据源适配器、报表导出器——需要在运行时动态加载
 * 外部模块并校验其结构，确保导出符合插件契约。
 *
 * 函数签名
 *   loadPlugin(specifier: string, options?: LoadPluginOptions): Promise<Plugin>
 *   - specifier：模块标识符或文件 URL
 *   - options.importer：自定义加载函数，默认为动态 import(specifier)
 *   - 返回：通过校验的 Plugin 对象（{ name, setup }）
 *
 *   isPlugin(value: unknown): value is Plugin
 *   - value：待校验的任意值
 *   - 返回：value 是 { name: 非空字符串, setup: 函数 } 时为 true
 *
 * 示例
 *   loadPlugin('virtual:plugin', {
 *     importer: async () => ({ default: { name: 'x', setup: () => 'ok' } }),
 *   })
 *   => { name: 'x', setup: [Function] }（优先使用 default 导出）
 *
 *   loadPlugin('virtual:named', {
 *     importer: async () => ({ name: 'y', setup: () => 'ok' }),
 *   })
 *   => { name: 'y', setup: [Function] }（无 default 时使用命名空间）
 *
 *   loadPlugin('virtual:bad', {
 *     importer: async () => ({ default: { name: '', setup: 'nope' } }),
 *   })
 *   => 抛 Error('插件必须导出 …')
 *
 * 要求
 *   1. 默认通过动态 import(specifier) 加载；支持 options.importer 注入自定义加载函数；
 *   2. 模块有 default 导出时优先使用 default，否则使用模块命名空间对象；
 *   3. 导出的对象必须满足 { name: 非空字符串, setup: 函数 }，否则抛 Error
 *      且 message 含"插件必须导出"，并保留 cause 为原始模块对象；
 *   4. 加载（importer 调用）抛错时抛 Error，message 含"插件加载失败"，cause 为原始错误；
 *   5. isPlugin 对非对象、null、name 非字符串/空串、setup 非函数均返回 false；
 *   6. specifier 为空串时抛 RangeError。
 *
 * 提示：插件代码拥有当前进程权限，只加载可信来源。
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
