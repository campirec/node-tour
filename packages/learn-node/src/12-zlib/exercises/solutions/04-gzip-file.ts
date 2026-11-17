import { createReadStream, createWriteStream } from 'node:fs';
import { mkdir, rename, rm, stat } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { dirname } from 'node:path';
import { pipeline } from 'node:stream/promises';
import { createGzip } from 'node:zlib';

export interface GzipFileResult {
  targetPath: string;
  originalBytes: number;
  compressedBytes: number;
}

export async function gzipFileAtomic(
  sourcePath: string,
  targetPath = `${sourcePath}.gz`,
): Promise<GzipFileResult> {
  if (!sourcePath || !targetPath) {
    throw new RangeError('sourcePath 与 targetPath 不能为空');
  }

  await mkdir(dirname(targetPath), { recursive: true });
  const tempPath = `${targetPath}.${process.pid}.${randomUUID()}.tmp`;

  try {
    await pipeline(
      createReadStream(sourcePath),
      createGzip(),
      createWriteStream(tempPath),
    );
    await rename(tempPath, targetPath);

    const [sourceInfo, targetInfo] = await Promise.all([
      stat(sourcePath),
      stat(targetPath),
    ]);

    return {
      targetPath,
      originalBytes: sourceInfo.size,
      compressedBytes: targetInfo.size,
    };
  } catch (error) {
    await rm(tempPath, { force: true });
    throw error;
  }
}
