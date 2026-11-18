import { Transform } from 'node:stream';

/**
 * 练习 1：实现按行切分的 Transform
 *
 * 场景：日志采集、NDJSON 解析、逐行协议处理。网络 chunk 与文本行没有对应
 * 关系——一行可能跨多个 chunk，一个 chunk 可能含多行，多字节字符可能被拆开。
 *
 * 函数签名
 *   createLineSplitter(): Transform
 *   - 返回：对象模式的 Transform，每个 push 的值是一行文本（不含换行符）
 *
 * 示例
 *   写入 '第一行\r\n第二行\n\n最后一行' 并结束
 *   => ['第一行', '第二行', '', '最后一行']
 *
 *   写入 Buffer('你好\n世界') 分两片 [0..4) [4..)
 *   => ['你好', '世界']
 *
 *   不写入任何数据直接 end
 *   => []
 *
 * 要求
 *   1. 输出对象模式，每行一个字符串（换行符不包含在输出中）；
 *   2. 同时支持 \n 与 \r\n 作为换行符；
 *   3. 使用 StringDecoder 处理跨 chunk 的多字节 UTF-8 字符拆分；
 *   4. 保留空行——连续换行产生的空字符串要作为独立行输出；
 *   5. 最后一行没有换行符时，在 flush 阶段输出该行；
 *   6. 空输入（无任何 write）输出零行（空数组）。
 */
export function createLineSplitter(): Transform {
  // TODO: new Transform({ readableObjectMode: true, transform, flush })
  throw new Error('TODO: createLineSplitter');
}
