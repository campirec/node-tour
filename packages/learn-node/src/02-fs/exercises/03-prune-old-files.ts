/**
 * 练习 3：清理目录中超过保留期的普通文件
 *
 * 场景：日志轮转、上传临时文件回收、构建缓存清理。只清理顶层的过期文件，
 * 不递归子目录，不碰符号链接。
 *
 * 函数签名
 *   pruneOldFiles(dir: string, cutoff: Date | number): Promise<PruneResult>
 *   - dir：目标目录
 *   - cutoff：时间截止线，Date 或毫秒时间戳；非法值（NaN/Infinity）抛 RangeError
 *   - 返回：{ removed, kept }，均为文件名数组（不含路径），按名称排序
 *
 * 示例
 *   // dir 下有 old.log(mtime 2h 前)、fresh.log(mtime 刚才)、archive/(子目录)
 *   await pruneOldFiles(dir, Date.now() - 60 * 60 * 1000)
 *   => { removed: ['old.log'], kept: ['fresh.log'] }
 *
 *   await pruneOldFiles(dir, NaN)
 *   => 抛 RangeError
 *
 * 要求
 *   1. 只处理 dir 顶层的普通文件（isFile），跳过子目录、符号链接等非文件条目；
 *   2. 文件 mtime（mtimeMs）严格小于 cutoff 时删除，否则保留；
 *   3. 返回 { removed, kept }，两个数组都只含文件名（不含路径），按名称排序；
 *   4. cutoff 接受 Date 或毫秒时间戳，非有限数字（NaN/Infinity）时抛 RangeError；
 *   5. 子目录即使 mtime 早于 cutoff 也不删除。
 */
export interface PruneResult {
  removed: string[];
  kept: string[];
}

export async function pruneOldFiles(
  dir: string,
  cutoff: Date | number,
): Promise<PruneResult> {
  // TODO: readdir withFileTypes -> stat -> rm
  throw new Error('TODO: pruneOldFiles');
}
