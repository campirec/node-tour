/**
 * 企业级练习：不透明分页游标编解码
 *
 * 场景：基于 (createdAt, id) 的 keyset 分页。对外暴露 base64url 字符串，
 * 客户端不应依赖其内部结构，服务端可演进版本。
 *
 * 编码载荷：{ v: 1, createdAt: ISO 字符串, id: 非空字符串 }
 *
 * 函数签名
 *   encodeCursor(cursor: Cursor): string
 *   - cursor：{ createdAt: string, id: string }
 *   - createdAt：合法的日期字符串（Date.parse 可解析）
 *   - id：非空字符串
 *   - 返回：无填充的 base64url 字符串（仅 [A-Za-z0-9_-]）
 *
 *   decodeCursor(value: string): Cursor
 *   - value：base64url 编码的游标字符串
 *   - 返回：{ createdAt, id } 游标对象
 *
 * 示例
 *   encodeCursor({ createdAt: '2026-01-02T03:04:05.000Z', id: 'abc' })
 *   => 仅含 [A-Za-z0-9_-] 的字符串，解码后 JSON 含 { v: 1, createdAt, id }
 *
 *   decodeCursor(encodeCursor({ createdAt: '2026-01-02T03:04:05.000Z', id: 'abc' }))
 *   => { createdAt: '2026-01-02T03:04:05.000Z', id: 'abc' }
 *
 *   encodeCursor({ createdAt: '...', id: '' })     => 抛 CursorError（id 为空）
 *   encodeCursor({ createdAt: 'not-a-date', id: 'a' }) => 抛 CursorError（非法日期）
 *   decodeCursor('bad+cursor')                     => 抛 CursorError（非法字符集）
 *   decodeCursor(encode(v:2,...))                  => 抛 CursorError（版本不匹配）
 *
 * 要求
 *   1. encodeCursor 校验 id 为非空字符串，否则抛 CursorError；
 *   2. encodeCursor 校验 createdAt 为合法日期字符串（Date.parse 结果非 NaN），否则
 *      抛 CursorError；
 *   3. encodeCursor 将 { v: 1, createdAt, id } 序列化为 JSON 后做 base64url 编码，
 *      返回字符串仅含 [A-Za-z0-9_-]，不直接暴露明文 JSON 字段名；
 *   4. decodeCursor 校验字符集为 [A-Za-z0-9_-]，非法字符（如 +）抛 CursorError；
 *   5. decodeCursor 校验 JSON 解析成功，解析失败抛 CursorError；
 *   6. decodeCursor 校验版本 v === 1，否则抛 CursorError；
 *   7. decodeCursor 校验 id 和 createdAt 字段存在且类型正确，缺失时抛 CursorError；
 *   8. decodeCursor 校验 id 非空、createdAt 为合法日期，非法时抛 CursorError；
 *   9. 所有错误统一抛 CursorError，不要抛通用 Error。
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
