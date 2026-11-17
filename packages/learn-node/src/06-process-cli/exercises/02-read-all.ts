/**
 * 练习 2：读取整个标准输入（或任意可异步迭代流）。
 *
 * 场景：CLI 接收管道输入、读取小型文本文件、处理 stdin heredoc。
 *
 * 要求：
 * - 支持 Buffer 与 string chunk；
 * - 多字节 UTF-8 字符被拆到两个 chunk 时仍能正确解码（Buffer.concat 后统一解码）；
 * - 默认上限 1 MiB，超过时抛出错误，避免恶意/误操作输入耗尽内存；
 * - maxBytes 必须是正整数。
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
