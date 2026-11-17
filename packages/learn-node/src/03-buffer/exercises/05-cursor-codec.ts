/**
 * 企业级练习：不透明分页游标编解码。
 *
 * 场景：基于 (createdAt, id) 的 keyset 分页。对外暴露 base64url 字符串，
 * 客户端不应依赖其内部结构，服务端可演进版本。
 *
 * 编码载荷：{ v: 1, createdAt: ISO 字符串, id: 非空字符串 }
 *
 * 要求：
 * - encodeCursor 校验字段，生成无填充的 base64url；
 * - decodeCursor 校验字符集、JSON、版本、字段与日期；
 * - 非法输入统一抛 CursorError；
 * - 不要在这里做签名；游标被篡改应通过签名/HMAC 另行防护。
 */
export class CursorError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'CursorError';
  }
}

export interface Cursor {
  createdAt: string;
  id: string;
}

export function encodeCursor(cursor: Cursor): string {
  // TODO
  throw new Error('TODO: encodeCursor');
}

export function decodeCursor(value: string): Cursor {
  // TODO
  throw new Error('TODO: decodeCursor');
}
