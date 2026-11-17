/**
 * 练习 3：流式读取 fetch 响应并按行解析。
 *
 * 场景：SSE、NDJSON、大日志下载、LLM 流式输出。
 *
 * 要求：
 * - 非 2xx 直接抛错；
 * - 使用 response.body.getReader() 增量读取，不调用 response.text()；
 * - 使用 TextDecoder({ stream: true }) 处理跨 chunk 的多字节字符；
 * - 支持 \n 与 \r\n；
 * - 最后一行没有换行时也要 yield；
 * - reader 必须在 finally 中 releaseLock()。
 */
export async function* streamLines(
  url: string,
  signal?: AbortSignal,
): AsyncGenerator<string> {
  // TODO
  throw new Error('TODO: streamLines');
}
