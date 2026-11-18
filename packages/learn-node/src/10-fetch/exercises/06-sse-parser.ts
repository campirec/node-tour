/**
 * 企业级练习：SSE（Server-Sent Events）流式解析
 *
 * 场景：实时通知、LLM 流式输出、日志推送。SSE 格式为
 * `event: <type>\ndata: <payload>\n\n`，每条消息以空行分隔。
 *
 * 函数签名
 *   parseSse(url: string, signal?: AbortSignal): AsyncGenerator<SseEvent>
 *   - url：SSE 端点地址
 *   - signal：可选 AbortSignal
 *   - 返回：异步生成器，每次 yield { event?, data, id?, retry? }
 *
 * 示例
 *   parseSse(`${baseUrl}/sse`)(响应体: ': welcome\n\nevent: message\ndata: hello\n\n')
 *   => [{ event: 'message', data: 'hello' }]
 *
 *   parseSse(`${baseUrl}/missing`)
 *   => 抛 Error('HTTP 404')
 *
 * 要求
 *   1. 使用 fetch 读取响应，通过 response.body.getReader() 流式解析；
 *   2. 非 2xx 抛 Error('HTTP ${status}')；
 *   3. response.body 为 null 时抛 Error('响应缺少 body')；
 *   4. 解析 event、data、id、retry 字段，忽略注释行（以 : 开头）；
 *   5. 每条消息以空行结束，data 多行用 \n 连接；
 *   6. 使用 TextDecoder({ stream: true }) 处理跨 chunk 的多字节字符；
 *   7. 支持 \r\n 行尾；最后一段无换行符时也要 flush；
 *   8. reader 在 finally 中 releaseLock()。
 */
export interface SseEvent {
  event?: string;
  data: string;
  id?: string;
  retry?: number;
}

export async function* parseSse(
  url: string,
  signal?: AbortSignal,
): AsyncGenerator<SseEvent> {
  // TODO: fetch -> response.body.getReader() -> 按行解析 SSE 字段
  throw new Error('TODO: parseSse');
}
