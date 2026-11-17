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

const BASE64URL = /^[A-Za-z0-9_-]+$/;

function decodeObject(segment: string, name: string): Record<string, unknown> {
  if (!BASE64URL.test(segment)) {
    throw new JwtDecodeError(`${name} 不是合法 base64url`);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(Buffer.from(segment, 'base64url').toString('utf8'));
  } catch (error) {
    throw new JwtDecodeError(`${name} 不是合法 JSON`, { cause: error });
  }

  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    throw new JwtDecodeError(`${name} 必须是 JSON 对象`);
  }
  return parsed as Record<string, unknown>;
}

export function decodeJwt(token: string): JwtParts {
  const segments = token.split('.');
  if (segments.length !== 3) {
    throw new JwtDecodeError('JWT 必须包含 3 段');
  }

  const [header, payload, signature] = segments as [string, string, string];
  if (!signature) {
    throw new JwtDecodeError('JWT 签名段不能为空');
  }

  return {
    header: decodeObject(header, 'header'),
    payload: decodeObject(payload, 'payload'),
    signature,
  };
}

export function isTokenExpired(
  payload: Record<string, unknown>,
  nowSeconds: number = Math.floor(Date.now() / 1000),
): boolean {
  return typeof payload.exp === 'number' && payload.exp <= nowSeconds;
}
