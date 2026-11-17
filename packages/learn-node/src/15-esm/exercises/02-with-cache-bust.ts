/**
 * 练习 2：给模块 URL 加缓存破坏参数。
 *
 * 场景：开发期热重载、插件系统重新加载同一路径的模块。
 * ESM 模块按 URL 缓存，加不同的 query 会得到新的模块实例：
 *
 *   await import(`${url}?v=1`);
 *   await import(`${url}?v=2`); // 重新执行模块
 *
 * 要求：
 * - 保留原有 query 与 hash；
 * - 重复调用时替换 v，而不是追加；
 * - version 支持字符串或数字；
 * - 空字符串版本抛 RangeError；
 * - 非法 URL 让 URL 构造器抛 TypeError。
 */
export function withCacheBust(
  url: string,
  version: string | number,
): string {
  // TODO
  throw new Error('TODO: withCacheBust');
}
