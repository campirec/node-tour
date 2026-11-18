import { resolve, sep } from 'node:path';

/**
 * 企业级练习：把用户提供的路径限制在允许的根目录内
 *
 * 场景：文件下载、上传落盘、静态资源服务、模板读取。
 * path.join(root, userInput) 无法阻止 '../../etc/passwd' 越界。
 *
 * 函数签名
 *   resolveWithinRoot(root: string, userPath: string): string
 *   - root：允许访问的根目录（绝对路径）
 *   - userPath：外部传入的路径，可以是相对路径或绝对路径
 *   - 返回：root 内的绝对路径
 *   - 越界或非法时抛 PathEscapeError（本文件已定义，不要抛通用 Error）
 *
 * 示例（root = '/srv/storage'）
 *   resolveWithinRoot(root, 'uploads/avatar.png')  => '/srv/storage/uploads/avatar.png'
 *   resolveWithinRoot(root, 'a/../b.txt')          => '/srv/storage/b.txt'
 *   resolveWithinRoot(root, '..')                  => 抛 PathEscapeError
 *   resolveWithinRoot(root, '/etc/passwd')         => 抛 PathEscapeError
 *
 * 要求
 *   1. userPath 为空串或包含 NUL 字节（'\0'）时抛 PathEscapeError；
 *   2. 含 '..' 的路径按解析结果判断：仍在 root 内就允许，越界才拒绝；
 *   3. 绝对路径同理：落在 root 内允许，落在 root 外拒绝；
 *   4. root 末尾是否带分隔符都不影响判断（'/srv/storage/' 与 '/srv/storage' 等价）；
 *   5. userPath 为 '.' 时返回 root 本身；
 *   6. 不访问文件系统；Windows 下路径比较忽略大小写（符号链接由调用方用 realpath 再校验）。
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
