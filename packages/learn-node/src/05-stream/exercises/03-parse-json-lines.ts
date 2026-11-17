import type { Readable } from 'node:stream';

/**
 * 练习 3：增量解析 NDJSON（每行一个 JSON）。
 *
 * 场景：日志导入、批量事件、LLM 流式输出的结构化消息。
 *
 * 要求：
 * - 返回异步生成器，逐行 yield，不把整个文件读进内存；
 * - 跳过空行；
 * - 支持 \r\n；
 * - 非法 JSON 的错误包含行号，并保留原始错误作为 cause；
 * - 最后一行没有换行符时也要解析。
 */
export async function* parseJsonLines<T = unknown>(
  readable: Readable,
): AsyncGenerator<T> {
  // TODO: for await (chunk) + StringDecoder + JSON.parse
  throw new Error('TODO: parseJsonLines');
}
