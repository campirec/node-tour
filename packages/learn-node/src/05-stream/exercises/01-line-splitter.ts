import { Transform } from 'node:stream';

/**
 * 练习 1：实现按行切分的 Transform。
 *
 * 难点：网络 chunk 与文本行没有对应关系。
 * - 一行可能被拆到多个 chunk；
 * - 一个 chunk 可能包含多行；
 * - 中文 UTF-8 字符可能被拆开；
 * - 最后一行可能没有换行符。
 *
 * 要求：
 * - 输出对象模式字符串（每行一个对象）；
 * - 支持 \n 与 \r\n；
 * - 使用 StringDecoder 处理跨 chunk 的多字节字符；
 * - 结束时 flush 最后一行（如果没有换行）。
 */
export function createLineSplitter(): Transform {
  // TODO: new Transform({ readableObjectMode: true, transform, flush })
  throw new Error('TODO: createLineSplitter');
}
