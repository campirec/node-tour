import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

/**
 * 练习 1：判断当前模块是否是程序入口
 *
 * 场景：CLI 工具需要区分"被直接执行"还是"被 import 引入"，以决定是否运行
 * 入口逻辑。CommonJS 有 require.main === module，ESM 没有对应属性，需要
 * 比较 import.meta.url 与 process.argv[1] 转换后的 file URL。
 *
 * 函数签名
 *   isMainModule(metaUrl: string, argv1?: string): boolean
 *   - metaUrl：当前模块的 import.meta.url
 *   - argv1：入口路径，默认取 process.argv[1]；可能为 undefined
 *   - 返回：argv1 经 resolve + pathToFileURL 转换后与 metaUrl 一致返回 true
 *
 * 示例
 *   isMainModule(pathToFileURL(resolve('cli.mjs')).href, resolve('cli.mjs'))
 *   => true
 *
 *   isMainModule(pathToFileURL(resolve('cli.mjs')).href, resolve('other.mjs'))
 *   => false
 *
 *   isMainModule(pathToFileURL(resolve('cli.mjs')).href, undefined)
 *   => false
 *
 * 要求
 *   1. argv1 为 undefined 或空串时返回 false；
 *   2. argv1 先用 path.resolve 转为绝对路径，再用 pathToFileURL 转为 file URL，
 *      以正确处理空格、中文与 Windows 盘符；
 *   3. 仅比较 URL 字符串，不访问文件系统；
 *   4. 路径不同时返回 false（不抛错）。
 *
 * 提示：通过符号链接启动时 argv[1] 可能是链接路径而 import.meta.url 是真实
 * 路径，比较会失败；生产 CLI 可以额外用 realpath 校正。
 */
export function isMainModule(
  metaUrl: string,
  argv1: string | undefined = process.argv[1],
): boolean {
  // TODO
  throw new Error('TODO: isMainModule');
}
