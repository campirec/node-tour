import type { IncomingMessage } from 'node:http';

/**
 * 练习 1：安全读取 HTTP 请求体并解析 JSON。
 *
 * 场景：任何自研 HTTP 框架/中间件都要做的事。
 *
 * 要求：
 * - 先检查 content-length，明显超限时不要读取；
 * - 流式累计字节数，超过 maxBytes 立即抛出 PayloadTooLargeError；
 * - 空请求体抛出 SyntaxError('请求体为空')；
 * - JSON 非法抛出 SyntaxError('请求体不是合法 JSON')，保留 cause；
 * - maxBytes 默认 1 MiB，必须是正数。
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
