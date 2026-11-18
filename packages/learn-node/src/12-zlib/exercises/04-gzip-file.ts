import { createReadStream, createWriteStream } from 'node:fs';
import { mkdir, rename, rm, stat } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { dirname } from 'node:path';
import { pipeline } from 'node:stream/promises';
import { createGzip } from 'node:zlib';

/**
 * 企业级练习：原子地把文件压缩为 .gz
 *
 * 场景：日志归档、备份、构建产物压缩。直接写目标 .gz 文件时进程中断会留下
 * 损坏的文件；先写临时文件再 rename 可以保证目标文件要么完整，要么不存在。
 *
 * 函数签名
 *   gzipFileAtomic(sourcePath: string, targetPath?: string): Promise<GzipFileResult>
 *   - sourcePath：源文件路径
 *   - targetPath：目标路径，默认为 `${sourcePath}.gz`
 *   - 返回：{ targetPath, originalBytes, compressedBytes }
 *     originalBytes 为源文件字节数，compressedBytes 为压缩后字节数
 *
 * 示例
 *   gzipFileAtomic('/tmp/app.log')
 *   => { targetPath: '/tmp/app.log.gz', originalBytes: 26000, compressedBytes: 180 }
 *
 *   gzipFileAtomic('/tmp/data.json', '/tmp/archive/data.json.gz')
 *   => 覆盖已有目标文件，返回 { targetPath: '/tmp/archive/data.json.gz', ... }
 *
 *   gzipFileAtomic('/tmp/missing.log', '/tmp/missing.gz')
 *   => 拒绝并抛含 code: 'ENOENT' 的错误，且不创建目标文件
 *
 * 要求
 *   1. 默认目标路径为 `${sourcePath}.gz`；
 *   2. 自动创建目标文件的父目录（recursive）；
 *   3. 写同目录临时文件，pipeline 成功后 rename 覆盖目标；
 *   4. 任一步骤失败时清理临时文件（rm force），再向上抛出原始错误；
 *   5. 返回结果包含 targetPath、originalBytes（源文件 stat.size）、
 *      compressedBytes（目标文件 stat.size）；
 *   6. 源文件不存在时保留 ENOENT 错误码，且不创建目标文件；
 *   7. 压缩完成后目录中不遗留临时文件。
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
