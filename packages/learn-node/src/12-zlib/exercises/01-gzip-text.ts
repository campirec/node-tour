import { gzip, gunzip } from 'node:zlib';
import { promisify } from 'node:util';

/**
 * 练习 1：Buffer 级 gzip 压缩与解压
 *
 * 场景：HTTP 响应体压缩、日志归档、传输前减小体积。需要在内存中对文本
 * 做 gzip / gunzip 往返，不涉及文件系统或网络。
 *
 * 函数签名
 *   gzipText(text: string): Promise<Buffer>
 *   - text：UTF-8 编码的原始字符串，可以是空串
 *   - 返回：gzip 格式 Buffer，前两个字节为 0x1f 0x8b
 *
 *   gunzipText(data: Buffer): Promise<string>
 *   - data：gzip 格式 Buffer
 *   - 返回：解压后的 UTF-8 字符串
 *
 * 示例
 *   gzipText('Node.js 压缩测试 '.repeat(100))
 *   => Buffer（以 0x1f 0x8b 开头，长度远小于原文）
 *   gunzipText(result) => 'Node.js 压缩测试 '.repeat(100)
 *
 *   gunzipText(Buffer.from('not gzip')) => 拒绝（zlib 错误向上传播）
 *
 * 要求
 *   1. gzipText 先将 text 转为 UTF-8 Buffer 再压缩，返回合法 gzip Buffer；
 *   2. gunzipText 解压后以 UTF-8 字符串返回，与原文完全一致（含中文）；
 *   3. 空字符串也能正常往返（gzipText('') 产生合法 gzip，gunzipText 还原为 ''）；
 *   4. 重复内容压缩后 byteLength 应小于原文字节长度；
 *   5. 传入非法 gzip 数据调用 gunzipText 时，让 zlib 的错误原样向上传播，不捕获。
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
