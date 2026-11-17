/**
 * 练习 2：递归列出目录中的所有普通文件。
 *
 * 要求：
 * - 返回相对 root 的路径，统一使用 '/' 分隔；
 * - 结果按字典序排序；
 * - 跳过符号链接，避免循环与意外越界；
 * - 空目录返回 []。
 *
 * 提示：readdir(dir, { withFileTypes: true }) 比 stat 每个条目更高效。
 */
export async function listFilesRecursive(root: string): Promise<string[]> {
  // TODO
  throw new Error('TODO: listFilesRecursive');
}
