/**
 * 练习 3：拆解路径并提供相对当前工作目录的展示形式。
 *
 * 要求：
 * - 相对路径基于 cwd 解析，绝对路径保持不变；
 * - dir 是绝对目录，name 是去掉扩展名的文件名，ext 带点（没有则为空串）；
 * - relativeToCwd 统一使用 '/' 分隔，便于日志与跨平台展示。
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
