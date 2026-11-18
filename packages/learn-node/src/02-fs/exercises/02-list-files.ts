/**
 * 练习 2：递归列出目录中的所有普通文件
 *
 * 场景：统计代码行数、查找重复文件、构建文件清单。需要遍历子目录，
 * 同时跳过符号链接以避免循环和意外越界。
 *
 * 函数签名
 *   listFilesRecursive(root: string): Promise<string[]>
 *   - root：要遍历的根目录路径
 *   - 返回：相对 root 的文件路径数组，统一用 '/' 分隔，按字典序排序；
 *           空目录返回 []，目录不存在时保留 ENOENT
 *
 * 示例
 *   // 目录结构：README.md, src/index.ts, src/nested/util.ts, empty/(空目录)
 *   await listFilesRecursive('/project')
 *   => ['README.md', 'src/index.ts', 'src/nested/util.ts']
 *
 *   await listFilesRecursive('/empty-dir')
 *   => []
 *
 * 要求
 *   1. 递归遍历 root 及其子目录，仅收集普通文件（isFile），跳过目录和符号链接；
 *   2. 返回路径相对于 root，统一使用 '/' 作分隔符（不包含 root 前缀）；
 *   3. 结果按字典序排序；
 *   4. 空目录返回 []；
 *   5. 目录不存在时保留 readdir 抛出的 ENOENT，不包装。
 *
 * 提示：readdir(dir, { withFileTypes: true }) 比 stat 每个条目更高效。
 */
export async function listFilesRecursive(root: string): Promise<string[]> {
  // TODO
  throw new Error('TODO: listFilesRecursive');
}
