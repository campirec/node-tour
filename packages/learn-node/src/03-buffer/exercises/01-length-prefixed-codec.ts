/**
 * 练习 1：实现长度前缀消息编解码。
 *
 * 线上协议常见格式：
 *
 *   +----------------+----------------------+
 *   | 4 字节大端长度 | UTF-8 消息体（N 字节）|
 *   +----------------+----------------------+
 *
 * 要求：
 * - encodeMessage 返回新 Buffer，不修改输入；
 * - decodeMessage 校验头部、长度与多余字节；
 * - 中文按 UTF-8 字节数计算，而不是字符串长度。
 */
export function encodeMessage(text: string): Buffer {
  // TODO: Buffer.alloc(4) + writeUInt32BE + Buffer.concat
  throw new Error('TODO: encodeMessage');
}

export function decodeMessage(data: Buffer): string {
  // TODO: readUInt32BE + 完整性校验 + subarray
  throw new Error('TODO: decodeMessage');
}
