import { pbkdf2, randomBytes, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const pbkdf2Async = promisify(pbkdf2);
const ALGORITHM = 'sha256';
const KEY_LENGTH = 32;

export interface DerivedKey {
  derivedKey: string;
  salt: string;
  iterations: number;
  algorithm: string;
}

export async function deriveKey(
  password: string,
  salt?: Buffer,
  iterations = 100_000,
): Promise<DerivedKey> {
  if (!password) {
    throw new Error('密码不能为空');
  }
  if (!Number.isInteger(iterations) || iterations < 10_000 || iterations > 1_000_000) {
    throw new RangeError('iterations 必须是 10000-1000000 的整数');
  }

  const actualSalt = salt ?? randomBytes(16);
  const derivedKey = await pbkdf2Async(password, actualSalt, iterations, KEY_LENGTH, ALGORITHM);

  return {
    derivedKey: derivedKey.toString('base64url'),
    salt: actualSalt.toString('base64url'),
    iterations,
    algorithm: ALGORITHM,
  };
}

export async function verifyDerivedKey(
  password: string,
  stored: DerivedKey,
): Promise<boolean> {
  if (!password) {
    throw new Error('密码不能为空');
  }

  const salt = Buffer.from(stored.salt, 'base64url');
  const expected = Buffer.from(stored.derivedKey, 'base64url');
  const actual = await pbkdf2Async(password, salt, stored.iterations, expected.length, stored.algorithm);

  return timingSafeEqual(actual, expected);
}
