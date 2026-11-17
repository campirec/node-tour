/**
 * 练习 3：按二进制分隔符切分 Buffer。
 *
 * 场景：读取自定义协议帧、解析多部分响应、按字节边界拆包。
 * 与 String.split 不同，分隔符可能跨 chunk，且内容不一定是文本。
 *
 * 要求：
 * - 返回的 Buffer 可以使用 subarray（共享内存，零拷贝）；
 * - 保留空片段：Buffer.from('a--') 按 '--' 切分得到 ['a', '']；
 * - 空输入返回 [空 Buffer]；
 * - 空分隔符抛出错误。
 */
export function splitBuffer(data: Buffer, delimiter: Buffer): Buffer[] {
  // TODO: indexOf(delimiter, start) 循环 + subarray
  throw new Error('TODO: splitBuffer');
}
