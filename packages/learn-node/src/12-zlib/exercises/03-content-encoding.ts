import { brotliCompress, gzip } from 'node:zlib';
import { promisify } from 'node:util';

/**
 * 练习 3：根据 Accept-Encoding 选择压缩算法。
 *
 * 场景：HTTP 响应压缩协商。
 *
 * 要求：
 * - 解析 `gzip, br;q=0.8, *;q=0.1` 这类头（q 范围 0-1，q=0 表示不可接受）；
 * - 支持 br / gzip / identity；
 * - 选择 q 最高的；q 相同优先 br，其次 gzip，最后 identity；
 * - 未提供 Accept-Encoding 或缺省时返回 identity；
 * - identity 的 body 是原文 Buffer。
 *
 * 提示：可以只做支持集合内的协商，不需要覆盖 RFC 全部细节。
 */
export type ContentEncoding = 'gzip' | 'br' | 'identity';

export interface CompressedPayload {
  encoding: ContentEncoding;
  body: Buffer;
}

export async function compressForEncoding(
  text: string,
  acceptEncoding: string,
): Promise<CompressedPayload> {
  // TODO
  throw new Error('TODO: compressForEncoding');
}
