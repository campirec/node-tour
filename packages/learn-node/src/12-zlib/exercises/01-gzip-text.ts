import { gzip, gunzip } from 'node:zlib';
import { promisify } from 'node:util';

/**
 * 练习 1：Buffer 级 gzip 压缩。
 *
 * 要求：
 * - gzipText 返回 gzip 格式 Buffer（前两个字节应为 0x1f 0x8b）；
 * - gunzipText 解压并转 UTF-8 字符串；
 * - 非法 gzip 数据让 zlib 的错误向上传播。
 *
 * 注意：gzip 适合文本；图片/视频/zip 等已压缩数据再压缩收益很低。
 */
const gzipAsync = promisify(gzip);
const gunzipAsync = promisify(gunzip);

export async function gzipText(text: string): Promise<Buffer> {
  // TODO
  throw new Error('TODO: gzipText');
}

export async function gunzipText(data: Buffer): Promise<string> {
  // TODO
  throw new Error('TODO: gunzipText');
}
