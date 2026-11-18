/**
 * 练习 1：实现长度前缀消息编解码
 *
 * 场景：自定义 TCP 协议常在消息体前加 4 字节大端长度头，
 * 让接收端先读头部、再按长度精确读取消息体，解决粘包/拆包问题。
 *
 * 函数签名
 *   encodeMessage(text: string): Buffer
 *   - text：UTF-8 编码的消息文本，可为空串
 *   - 返回：新 Buffer，前 4 字节为大端长度，后续为 UTF-8 消息体
 *
 *   decodeMessage(data: Buffer): string
 *   - data：完整的长度前缀帧（4 字节头 + 消息体）
 *   - 返回：从消息体解码出的 UTF-8 字符串
 *
 * 示例
 *   encodeMessage('你好')
 *   => <Buffer 00 00 00 06 e4 bd a0 e5 a5 bd>（头部值为 6，因为"你好"占 6 字节）
 *
 *   decodeMessage(encodeMessage('你好，Node.js'))
 *   => '你好，Node.js'
 *
 *   decodeMessage(Buffer.from([0, 0, 0]))   => 抛 Error('消息头不完整')
 *   decodeMessage(encodeMessage('abcdef').subarray(0, 8))
 *   => 抛 Error('消息体不完整')
 *   decodeMessage(Buffer.concat([encodeMessage('ok'), Buffer.from([1])]))
 *   => 抛 Error('消息包含多余字节')
 *
 * 要求
 *   1. encodeMessage 返回新 Buffer，不修改输入；头部值为 UTF-8 字节数而非字符串长度；
 *   2. decodeMessage 在 data.length < 4 时抛 Error('消息头不完整')；
 *   3. 头部声明长度 > 实际消息体长度时抛 Error('消息体不完整')；
 *   4. 头部声明长度 < 实际消息体长度时（尾部有多余字节）抛 Error('消息包含多余字节')；
 *   5. 空串往返合法：encodeMessage('') 头部值为 0，decodeMessage 返回 ''；
 *   6. 中文等多字节字符按 UTF-8 字节数计算（如"你好"长度为 6）。
 */
export function encodeMessage(text: string): Buffer {
  // TODO: Buffer.alloc(4) + writeUInt32BE + Buffer.concat
  throw new Error('TODO: encodeMessage');
}

export function decodeMessage(data: Buffer): string {
  // TODO: readUInt32BE + 完整性校验 + subarray
  throw new Error('TODO: decodeMessage');
}
