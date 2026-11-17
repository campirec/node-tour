/**
 * 企业级练习：SSE（Server-Sent Events）流式解析。
 *
 * 场景：实时通知、LLM 流式输出、日志推送。
 * SSE 格式：`event: <type>\ndata: <payload>\n\n`，每条消息以空行分隔。
 *
 * 要求：
 * - 使用 fetch 读取 SSE 端点，通过 response.body 流式解析；
 * - 解析 event、data、id、retry 字段，忽略注释行（以 : 开头）；
 * - 每条消息以空行结束，data 多行用 \n 连接；
 * - 返回异步生成器，yield { event?, data, id?, retry? }；
 * - 非 2xx 响应抛错；
 * - 支持 AbortSignal；
 * - 非法响应体（无 body）抛错。
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
