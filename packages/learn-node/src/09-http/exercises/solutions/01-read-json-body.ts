import type { IncomingMessage } from 'node:http';

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
  if (!Number.isFinite(maxBytes) || maxBytes < 1) {
    throw new RangeError('maxBytes 必须是正数');
  }

  const declaredLength = Number(request.headers['content-length']);
  if (Number.isFinite(declaredLength) && declaredLength > maxBytes) {
    throw new PayloadTooLargeError(maxBytes);
  }

  const chunks: Buffer[] = [];
  let total = 0;

  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    total += buffer.byteLength;
    if (total > maxBytes) {
      throw new PayloadTooLargeError(maxBytes);
    }
    chunks.push(buffer);
  }

  if (total === 0) {
    throw new SyntaxError('请求体为空');
  }

  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8')) as T;
  } catch (error) {
    throw new SyntaxError('请求体不是合法 JSON', { cause: error });
  }
}
