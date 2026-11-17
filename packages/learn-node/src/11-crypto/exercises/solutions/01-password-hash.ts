import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scryptAsync = promisify(scrypt);
const KEY_LENGTH = 64;
const SCHEME = 'scrypt';

export async function hashPassword(password: string): Promise<string> {
  if (!password) {
    throw new Error('密码不能为空');
  }

  const salt = randomBytes(16);
  const key = (await scryptAsync(password, salt, KEY_LENGTH)) as Buffer;
  return `${SCHEME}$${salt.toString('base64url')}$${key.toString('base64url')}`;
}

export async function verifyPassword(
  password: string,
  stored: string,
): Promise<boolean> {
  const parts = stored.split('$');
  if (parts.length !== 3 || parts[0] !== SCHEME) {
    return false;
  }

  try {
    const salt = Buffer.from(parts[1] ?? '', 'base64url');
    const expected = Buffer.from(parts[2] ?? '', 'base64url');
    if (salt.length === 0 || expected.length !== KEY_LENGTH) {
      return false;
    }

    const actual = (await scryptAsync(
      password,
      salt,
      expected.length,
    )) as Buffer;
    return timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}
