/**
 * 企业级练习：解析 JWT 的结构（不验证签名）。
 *
 * 场景：网关日志、调试工具、从已由鉴权中间件校验过的 token 中读取 claims。
 * 绝不能把“能解码”当成“已认证”——签名验证必须使用 crypto/jose 完成。
 *
 * 要求：
 * - token 必须由 3 段 base64url 组成；
 * - header/payload 解码后必须是 JSON 对象；
 * - 任一段非法抛 JwtDecodeError，错误信息说明是哪一段；
 * - signature 只检查非空，不做密码学校验；
 * - isTokenExpired 在 exp 存在且 <= now 时返回 true，无 exp 返回 false。
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
