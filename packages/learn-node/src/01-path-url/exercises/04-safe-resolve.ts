import { resolve, sep } from 'node:path';

/**
 * 企业级练习：把用户提供的路径限制在允许的根目录内。
 *
 * 场景：文件下载、上传落盘、静态资源服务、模板读取。
 * `path.join(root, userInput)` 无法阻止 `../../etc/passwd`。
 *
 * 要求：
 * - userPath 为空或含 NUL 字节时抛 PathEscapeError；
 * - `..` 解析后仍在 root 内则允许；
 * - 绝对路径若在 root 内则允许，在 root 外拒绝；
 * - 路径比较在 Windows 下忽略大小写；
 * - 不访问文件系统（符号链接需调用方用 realpath 再校验）。
 */
export class PathEscapeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PathEscapeError';
  }
}

export function resolveWithinRoot(root: string, userPath: string): string {
  // TODO
  throw new Error('TODO: resolveWithinRoot');
}
