import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';

export interface GeneratedApiKey {
  token: string;
  hash: string;
  prefix: string;
}

const PREFIX_PATTERN = /^[a-z0-9_]{2,20}$/i;
const HASH_PATTERN = /^[0-9a-f]{64}$/i;

export function generateApiKey(prefix = 'sk_live'): GeneratedApiKey {
  if (!PREFIX_PATTERN.test(prefix)) {
    throw new RangeError('prefix 必须匹配 /^[a-z0-9_]{2,20}$/i');
  }

  const secret = randomBytes(32).toString('base64url');
  const token = `${prefix}_${secret}`;
  return {
    token,
    hash: hashApiKey(token),
    prefix: token.slice(0, 12),
  };
}

export function hashApiKey(token: string): string {
  if (!token) {
    throw new Error('token 不能为空');
  }
  return createHash('sha256').update(token, 'utf8').digest('hex');
}

export function verifyApiKey(token: string, storedHash: string): boolean {
  if (!token || !HASH_PATTERN.test(storedHash)) {
    return false;
  }

  const expected = Buffer.from(storedHash, 'hex');
  const actual = Buffer.from(hashApiKey(token), 'hex');
  return (
    expected.length === actual.length && timingSafeEqual(expected, actual)
  );
}
