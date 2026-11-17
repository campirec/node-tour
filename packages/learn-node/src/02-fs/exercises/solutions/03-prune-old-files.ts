import { readdir, rm, stat } from 'node:fs/promises';
import { join } from 'node:path';

export interface PruneResult {
  removed: string[];
  kept: string[];
}

export async function pruneOldFiles(
  dir: string,
  cutoff: Date | number,
): Promise<PruneResult> {
  const cutoffMs = cutoff instanceof Date ? cutoff.getTime() : cutoff;
  if (!Number.isFinite(cutoffMs)) {
    throw new RangeError('cutoff 必须是有效的日期或毫秒时间戳');
  }

  const entries = await readdir(dir, { withFileTypes: true });
  const removed: string[] = [];
  const kept: string[] = [];

  for (const entry of entries) {
    if (!entry.isFile()) {
      continue;
    }
    const filePath = join(dir, entry.name);
    const info = await stat(filePath);
    if (info.mtimeMs < cutoffMs) {
      await rm(filePath, { force: true });
      removed.push(entry.name);
    } else {
      kept.push(entry.name);
    }
  }

  return {
    removed: removed.sort(),
    kept: kept.sort(),
  };
}
