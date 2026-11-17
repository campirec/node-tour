import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

/**
 * 练习 1：判断当前模块是否是程序入口。
 *
 * CommonJS 有 require.main === module；ESM 没有对应属性。
 * 常见写法是比较 import.meta.url 与 process.argv[1] 的 file URL。
 *
 * 要求：
 * - argv1 为空时返回 false；
 * - 相对 argv1 先 resolve 成绝对路径；
 * - 使用 pathToFileURL 处理空格、中文与 Windows 盘符；
 * - 不读取文件系统。
 *
 * 注意：通过符号链接启动时，argv[1] 可能是链接路径而 import.meta.url 是真实路径，
 * 这种情况下比较会失败。生产 CLI 可以额外使用 realpath。
 */
export function isMainModule(
  metaUrl: string,
  argv1: string | undefined = process.argv[1],
): boolean {
  // TODO
  throw new Error('TODO: isMainModule');
}
