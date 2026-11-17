import type { Readable } from 'node:stream';

/**
 * 练习 2：流式 gzip。
 *
 * 要求：
 * - 使用 pipeline(readable, createGzip(), collector)，不要先读到内存再压缩；
 * - collector 用 Writable 收集 Buffer；
 * - 返回完整 gzip Buffer；
 * - 上游错误通过 pipeline reject。
 */
export async function gzipStream(readable: Readable): Promise<Buffer> {
  // TODO
  throw new Error('TODO: gzipStream');
}
