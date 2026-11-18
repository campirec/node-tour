/**
 * 练习 1：以当前模块为基准解析资源路径
 *
 * 场景：读取与源码一起发布的模板、配置、fixture 文件。启动目录会随运行方式变化，
 * 而 import.meta.url 始终指向模块自身，用它做基准最稳定。
 *
 * 函数签名
 *   resolveFromImportMeta(metaUrl: string, relativePath: string): string
 *   - metaUrl：模块的 import.meta.url，file:// 形式的绝对 URL
 *   - relativePath：相对该模块所在目录的路径，或一个绝对路径
 *   - 返回：规范化后的绝对文件路径
 *
 * 示例（模块位于 /app/src/config/loader.mjs）
 *   resolveFromImportMeta('file:///app/src/config/loader.mjs', '../assets/data.json')
 *   => '/app/src/assets/data.json'
 *
 * 要求
 *   1. 先从 metaUrl 还原出模块文件路径，取它所在目录，再与 relativePath 合并；
 *   2. relativePath 是绝对路径时直接返回它，不要再拼模块目录；
 *   3. 返回值必须是绝对路径，且能正确处理 Windows / macOS / Linux 的路径格式；
 *   4. 路径中含空格或中文时不能出错（不要手写字符串截取，用 node:url 与 node:path）。
 *
 * 提示
 *   fileURLToPath(metaUrl) -> dirname(...) -> resolve(..., relativePath)
 */
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export function resolveFromImportMeta(
  metaUrl: string,
  relativePath: string,
): string {
  // TODO: fileURLToPath(metaUrl) -> dirname(...) -> resolve(..., relativePath)
  const url = fileURLToPath(metaUrl);
  return resolve(dirname(url), relativePath);
  // throw new Error("TODO: resolveFromImportMeta");
}
