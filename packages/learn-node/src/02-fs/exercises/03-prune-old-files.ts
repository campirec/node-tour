/**
 * 练习 3：清理目录中超过保留期的普通文件。
 *
 * 场景：日志轮转、上传临时文件回收、构建缓存清理。
 *
 * 要求：
 * - 只处理 dir 顶层的普通文件，跳过子目录与符号链接；
 * - mtime 早于 cutoff 的文件删除，其余保留；
 * - 返回按名称排序的 removed / kept；
 * - cutoff 支持 Date 或毫秒时间戳，非法值抛出 RangeError。
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
