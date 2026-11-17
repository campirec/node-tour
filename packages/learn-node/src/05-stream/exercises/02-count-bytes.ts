import type { Readable } from 'node:stream';

/**
 * 练习 2：统计流的总字节数。
 *
 * 要求：
 * - 使用 node:stream/promises 的 pipeline 串联可读流与自定义 Writable；
 * - 不要一次性把流读成字符串（会丢失字节语义并放大内存）；
 * - 上游出错时 pipeline 必须 reject。
 *
 * 提示：Writable 默认会把字符串 chunk 转成 Buffer。
 */
export async function countBytes(readable: Readable): Promise<number> {
  // TODO: new Writable({ write(chunk, encoding, callback) { ... } }) + pipeline
  throw new Error('TODO: countBytes');
}
