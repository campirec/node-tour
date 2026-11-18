/**
 * 练习 3：拆解路径并生成相对工作目录的展示形式
 *
 * 场景：日志、错误信息、调试面板里需要同时给出绝对目录和“相对项目根”的简短路径。
 *
 * 函数签名
 *   inspectPath(input: string, cwd?: string): PathInfo
 *   - input：要分析的路径，可以是相对 cwd 的路径，也可以是绝对路径
 *   - cwd：基准目录，默认 process.cwd()
 *   - 返回：{ dir, name, ext, isAbsolute, relativeToCwd }
 *
 * 示例（cwd = '/app/project'）
 *   inspectPath('data/report.json.gz')
 *   => {
 *        dir: '/app/project/data',
 *        name: 'report.json',
 *        ext: '.gz',
 *        isAbsolute: false,
 *        relativeToCwd: 'data/report.json.gz',
 *      }
 *
 * 字段含义
 *   - dir：解析后绝对路径的目录部分
 *   - name：去掉最后一个扩展名的文件名（'report.json.gz' -> 'report.json'）
 *   - ext：最后一个扩展名，带点；没有扩展名时为空串（'.env' 的 name 是 '.env'、ext 是 ''）
 *   - isAbsolute：input 本身是否绝对路径，不是解析后的结果
 *   - relativeToCwd：从 cwd 指向目标的相对路径，用 '/' 分隔，上级目录用 '..'
 *
 * 要求
 *   1. 相对 input 基于 cwd 解析；绝对 input 不再拼 cwd；
 *   2. relativeToCwd 中的路径分隔符统一成 '/'，保证跨平台展示一致；
 *   3. 支持无扩展名文件、点文件（.env）和 ../ 形式的上级路径。
 */

import { resolve, isAbsolute, dirname, basename, extname, relative, sep } from 'node:path'
export interface PathInfo {
  dir: string;
  name: string;
  ext: string;
  isAbsolute: boolean;
  relativeToCwd: string;
}

export function inspectPath(
  input: string,
  cwd: string = process.cwd(),
): PathInfo {
  // TODO: resolve + path.parse + relative，并把 sep 统一成 '/'
  const absolutePath = resolve(cwd, input)
  return {
    dir: dirname(absolutePath),
    name: basename(input, extname(input)),
    ext: extname(input),
    isAbsolute: isAbsolute(input),
    relativeToCwd: relative(cwd, absolutePath).split(sep).join('/')
  } satisfies PathInfo
}
