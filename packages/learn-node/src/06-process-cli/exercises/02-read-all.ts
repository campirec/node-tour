/**
 * 练习 2：读取整个标准输入（或任意可异步迭代流）
 *
 * 场景：CLI 接收管道输入、读取小型文本文件、处理 stdin heredoc。需要拼接
 * 所有 chunk 并正确解码，同时限制总量避免内存耗尽。
 *
 * 函数签名
 *   readAll(stream: AsyncIterable<Buffer | string>, options?: ReadAllOptions):
 *     Promise<string>
 *   - stream：可异步迭代的流，chunk 可以是 Buffer 或 string
 *   - options.maxBytes：最大字节数，默认 1048576（1 MiB）
 *   - 返回：拼接后的完整字符串
 *
 * 示例
 *   readAll(Readable.from(['hello', ' ', 'world']))
 *   => 'hello world'
 *
 *   readAll(Readable.from([data.subarray(0,4), data.subarray(4)]))
 *   // '你好，世界' 的 UTF-8 被拆到两个 chunk，拼接后正确解码
 *   => '你好，世界'
 *
 *   readAll(Readable.from([]))
 *   => ''
 *
 *   readAll(Readable.from(['12345', '67890']), { maxBytes: 8 })
 *   => rejects，消息 '输入超过 8 字节上限'
 *
 * 要求
 *   1. 支持 Buffer 与 string chunk，统一收集后 Buffer.concat 再以 UTF-8 解码；
 *   2. 多字节 UTF-8 字符被拆到两个 chunk 时仍能正确解码；
 *   3. 空输入返回空字符串 ''；
 *   4. 累计字节数超过 maxBytes 时 reject，消息为 '输入超过 N 字节上限'（N 为 maxBytes 值）；
 *   5. maxBytes 必须是正整数，否则抛 RangeError。
 */
export interface ReadAllOptions {
  maxBytes?: number;
}

export async function readAll(
  stream: AsyncIterable<Buffer | string>,
  options: ReadAllOptions = {},
): Promise<string> {
  // TODO: for await (chunk) + Buffer.concat
  throw new Error('TODO: readAll');
}
