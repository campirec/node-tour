/**
 * 练习 3：按二进制分隔符切分 Buffer
 *
 * 场景：解析自定义协议帧、多部分响应、按字节边界拆包。与 String.split 不同，
 * 分隔符可以是多字节序列，内容也不一定是文本，需要直接在 Buffer 层面操作。
 *
 * 函数签名
 *   splitBuffer(data: Buffer, delimiter: Buffer): Buffer[]
 *   - data：待切分的原始 Buffer
 *   - delimiter：二进制分隔符，长度 >= 1
 *   - 返回：切分后的 Buffer 数组，各片段为 data 的 subarray（共享内存，零拷贝）
 *
 * 示例
 *   splitBuffer(Buffer.from('alpha,beta,,gamma'), Buffer.from(','))
 *   => ['alpha', 'beta', '', 'gamma']（toString 后）
 *
 *   splitBuffer(Buffer.from('第一段|分隔|第二段|分隔|'), Buffer.from('|分隔|'))
 *   => ['第一段', '第二段', '']（toString 后）
 *
 *   splitBuffer(Buffer.from([0, 1, 2, 3]), Buffer.from([9, 9]))
 *   => [Buffer.from([0, 1, 2, 3])]（无匹配时返回单一片段）
 *
 *   splitBuffer(Buffer.alloc(0), Buffer.from(','))
 *   => [Buffer.alloc(0)]（空输入返回含一个空 Buffer 的数组）
 *
 *   splitBuffer(Buffer.from('a'), Buffer.alloc(0))
 *   => 抛 Error('分隔符不能为空')
 *
 * 要求
 *   1. 按 delimiter 逐次查找切分，返回的各片段使用 subarray（共享原 Buffer 内存）；
 *   2. 保留空片段：连续分隔符或尾部分隔符产生的空片段都要保留
 *      （如 'a--' 按 '--' 切分得到 ['a', '']）；
 *   3. 无匹配分隔符时返回长度为 1 的数组，唯一元素等于整个 data；
 *   4. 空输入 Buffer 返回 [空 Buffer]（长度为 1 的数组）；
 *   5. 空分隔符（length === 0）抛 Error('分隔符不能为空')；
 *   6. 支持多字节分隔符（含 UTF-8 多字节字符序列）。
 */
export function splitBuffer(data: Buffer, delimiter: Buffer): Buffer[] {
  // TODO: indexOf(delimiter, start) 循环 + subarray
  throw new Error('TODO: splitBuffer');
}
