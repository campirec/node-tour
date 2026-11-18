import type { Readable } from 'node:stream';

/**
 * 练习 3：增量解析 NDJSON（每行一个 JSON）
 *
 * 场景：日志导入、批量事件消费、LLM 流式输出的结构化消息。逐行解析，
 * 不把整个文件读进内存。
 *
 * 函数签名
 *   parseJsonLines<T>(readable: Readable): AsyncGenerator<T>
 *   - readable：可读流，chunk 可以是 Buffer 或 string
 *   - 返回：异步生成器，逐行 yield JSON.parse 的结果
 *
 * 示例
 *   输入 '{"id":1}\n\n{"id":2,"name":"B"}\r\n{"id":3}'（可跨多个 chunk）
 *   => [{ id: 1 }, { id: 2, name: 'B' }, { id: 3 }]
 *
 *   输入 '{"ok":true}\nnot-json\n{"after":true}\n'
 *   => 第二行抛出错误，消息包含 '第 2 行'
 *
 * 要求
 *   1. 返回异步生成器，逐行 yield，不把整个流缓存到内存；
 *   2. 跳过空行（连续换行或仅空白的不 yield）；
 *   3. 支持 \n 与 \r\n 换行符；
 *   4. 使用 StringDecoder 处理跨 chunk 的多字节 UTF-8 字符；
 *   5. 最后一行没有换行符时也要解析并 yield；
 *   6. 非法 JSON 时抛出错误，消息包含行号（如 '第 2 行'），
 *      并保留原始 JSON.parse 错误作为 cause。
 */
export async function* parseJsonLines<T = unknown>(
  readable: Readable,
): AsyncGenerator<T> {
  // TODO: for await (chunk) + StringDecoder + JSON.parse
  throw new Error('TODO: parseJsonLines');
}
