/**
 * 练习 2：给模块 URL 加缓存破坏参数
 *
 * 场景：开发期热重载、插件系统重新加载同一路径的模块。ESM 按完整 URL 缓存，
 * 加不同的 query 参数即可获得新的模块实例。
 *
 * 函数签名
 *   withCacheBust(url: string, version: string | number): string
 *   - url：模块的完整 URL（必须是合法绝对 URL）
 *   - version：版本标识，字符串或数字；空串会被拒绝
 *   - 返回：在 url 上设置 v=<version> 后的完整 URL 字符串
 *
 * 示例
 *   withCacheBust('https://cdn.test/plugin.mjs?debug=1#main', 2)
 *   => 'https://cdn.test/plugin.mjs?debug=1&v=2#main'
 *
 *   withCacheBust(withCacheBust('https://cdn.test/plugin.mjs', 1), 2)
 *   => 'https://cdn.test/plugin.mjs?v=2'（替换而非追加）
 *
 *   withCacheBust('https://cdn.test/a.mjs', '')
 *   => 抛 RangeError
 *
 * 要求
 *   1. 保留 url 原有的 query 参数与 hash，v 以覆盖方式设置（重复调用不追加）；
 *   2. version 为数字时转为字符串后设置；
 *   3. version 为空串时抛 RangeError；
 *   4. url 不是合法绝对 URL 时让 URL 构造器抛 TypeError，不要捕获后忽略；
 *   5. 特殊字符（中文、空格等）由 URL 构造器自动编码。
 */
export function withCacheBust(
  url: string,
  version: string | number,
): string {
  // TODO
  throw new Error('TODO: withCacheBust');
}
