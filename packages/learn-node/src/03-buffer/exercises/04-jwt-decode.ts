/**
 * 企业级练习：解析 JWT 的结构（不验证签名）
 *
 * 场景：网关日志、调试工具、从已由鉴权中间件校验过的 token 中读取 claims。
 * 绝不能把"能解码"当成"已认证"——签名验证必须使用 crypto/jose 完成。
 *
 * 函数签名
 *   decodeJwt(token: string): JwtParts
 *   - token：JWT 字符串，期望格式为 header.payload.signature
 *   - 返回：{ header, payload, signature }，header/payload 为解析后的 JSON 对象，
 *     signature 为原始字符串（仅检查非空，不做密码学校验）
 *
 *   isTokenExpired(payload: Record<string, unknown>, nowSeconds?: number): boolean
 *   - payload：JWT payload 对象
 *   - nowSeconds：当前时间戳（秒），默认 Math.floor(Date.now() / 1000)
 *   - 返回：payload.exp 存在且为 number 且 <= nowSeconds 时返回 true，否则 false
 *
 * 示例
 *   decodeJwt(encodePart({ alg: 'HS256', typ: 'JWT' })
 *     + '.' + encodePart({ sub: 'user-1', role: 'admin' }) + '.sig')
 *   => { header: { alg: 'HS256', typ: 'JWT' },
 *        payload: { sub: 'user-1', role: 'admin' },
 *        signature: 'sig' }
 *
 *   decodeJwt('a.b')            => 抛 JwtDecodeError（含 '3 段'）
 *   decodeJwt('header.payload.')=> 抛 JwtDecodeError（含 '签名'）
 *   decodeJwt('a+b.c.d')        => 抛 JwtDecodeError（含 'header'）
 *
 *   isTokenExpired({ exp: 100 }, 100)   => true（exp <= now）
 *   isTokenExpired({ exp: 101 }, 100)   => false
 *   isTokenExpired({}, 100)             => false（无 exp）
 *   isTokenExpired({ exp: '100' }, 100) => false（exp 非 number）
 *
 * 要求
 *   1. token 必须由 '.' 分隔的 3 段组成，段数不等于 3 时抛 JwtDecodeError；
 *   2. signature 段不能为空，否则抛 JwtDecodeError（信息含'签名'）；
 *   3. header、payload 每段必须是合法 base64url（仅 [A-Za-z0-9_-]），否则
 *      抛 JwtDecodeError，错误信息说明是哪一段（含 'header' 或 'payload'）；
 *   4. header、payload 解码后必须是 JSON 对象（非数组、非 null、非原始类型），
 *      否则抛 JwtDecodeError，错误信息含对应段名；
 *   5. 支持中文 claims（如 { name: '张三' }）；
 *   6. isTokenExpired 仅当 payload.exp 为 number 且 exp <= nowSeconds 时返回 true，
 *      exp 不存在或类型不是 number 时返回 false。
 */
export class JwtDecodeError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'JwtDecodeError';
  }
}

export interface JwtParts {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
}

export function decodeJwt(token: string): JwtParts {
  // TODO
  throw new Error('TODO: decodeJwt');
}

export function isTokenExpired(
  payload: Record<string, unknown>,
  nowSeconds: number = Math.floor(Date.now() / 1000),
): boolean {
  // TODO
  throw new Error('TODO: isTokenExpired');
}
