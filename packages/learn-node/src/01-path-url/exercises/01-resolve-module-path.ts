/**
 * 练习 1：以当前模块为基准解析资源路径。
 *
 * 场景：读取与源码一起发布的模板、配置、fixture 文件。
 * process.cwd() 会随启动目录变化，而 import.meta.url 始终指向模块自身。
 *
 * 要求：
 * - 支持 Windows / macOS / Linux；
 * - relativePath 既可以是相对路径，也可以是绝对路径；
 * - 返回值必须是绝对路径。
 */
export function resolveFromImportMeta(
  metaUrl: string,
  relativePath: string,
): string {
  // TODO: fileURLToPath(metaUrl) -> dirname(...) -> resolve(..., relativePath)
  throw new Error('TODO: resolveFromImportMeta');
}
