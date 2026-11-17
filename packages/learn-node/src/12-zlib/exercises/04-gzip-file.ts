import { createReadStream, createWriteStream } from 'node:fs';
import { mkdir, rename, rm, stat } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { dirname } from 'node:path';
import { pipeline } from 'node:stream/promises';
import { createGzip } from 'node:zlib';

/**
 * 企业级练习：原子地把文件压缩为 .gz。
 *
 * 场景：日志归档、备份、构建产物。直接写目标文件时进程中断会留下损坏的 .gz。
 *
 * 要求：
 * - 默认目标为 `${sourcePath}.gz`；
 * - 自动创建目标父目录；
 * - 写同目录临时文件，pipeline 成功后 rename 覆盖目标；
 * - 任一步失败清理临时文件；
 * - 返回目标路径、原始字节数、压缩后字节数；
 * - 源文件不存在时保留 ENOENT。
 */
export interface GzipFileResult {
  targetPath: string;
  originalBytes: number;
  compressedBytes: number;
}

export async function gzipFileAtomic(
  sourcePath: string,
  targetPath = `${sourcePath}.gz`,
): Promise<GzipFileResult> {
  // TODO
  throw new Error('TODO: gzipFileAtomic');
}
