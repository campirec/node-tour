import type { IncomingMessage } from 'node:http';

/**
 * 练习 1：安全读取 HTTP 请求体并解析 JSON
 *
 * 场景：自研 HTTP 框架或中间件需要从 IncomingMessage 流中读取请求体，
 * 同时防止超大请求体耗尽内存。
 *
 * 函数签名
 *   readJsonBody<T>(request: IncomingMessage, maxBytes?: number): Promise<T>
 *   - request：Node HTTP 请求对象（可读流）
 *   - maxBytes：请求体字节上限，默认 1 MiB，必须是正数
 *   - 返回：解析后的 JSON 对象；空请求体或非法 JSON 时抛错
 *
 * 示例
 *   readJsonBody(req, 32)
 *   => { ok: true }（请求体为 '{"ok":true}'）
 *
 *   readJsonBody(req, 32)
 *   => 抛 PayloadTooLargeError（content-length 超过 32）
 *
 *   readJsonBody(req, 32)
 *   => 抛 SyntaxError('请求体为空')（请求体为空串）
 *
 * 要求
 *   1. maxBytes 非有限数或 < 1 时抛 RangeError；
 *   2. content-length 超过 maxBytes 时立即抛 PayloadTooLargeError，不读取流；
 *   3. 流式累计字节数，超过 maxBytes 立即抛 PayloadTooLargeError；
 *   4. 请求体为空（累计字节数 0）时抛 SyntaxError('请求体为空')；
 *   5. JSON 解析失败时抛 SyntaxError('请求体不是合法 JSON')，保留 cause；
 *   6. PayloadTooLargeError 携带 statusCode = 413 与 maxBytes 信息。
 */
export class PayloadTooLargeError extends Error {
  readonly statusCode = 413;

  constructor(maxBytes: number) {
    super(`请求体超过 ${maxBytes} 字节上限`);
    this.name = 'PayloadTooLargeError';
  }
}

export async function readJsonBody<T = unknown>(
  request: IncomingMessage,
  maxBytes = 1024 * 1024,
): Promise<T> {
  // TODO: 校验 maxBytes -> content-length -> for await -> JSON.parse
  throw new Error('TODO: readJsonBody');
}
