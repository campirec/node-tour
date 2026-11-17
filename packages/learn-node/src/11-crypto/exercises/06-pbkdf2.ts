import { pbkdf2, randomBytes, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

/**
 * 企业级练习：PBKDF2 密钥派生与验证。
 *
 * 场景：用户密码存储、API 密钥派生、主密码保护本地密钥。
 * PBKDF2 是 Node 内置的慢哈希，比 scrypt 更通用，比 argon2 无原生依赖。
 *
 * 要求：
 * - deriveKey 使用 PBKDF2-HMAC-SHA256，默认 100_000 次迭代，输出 32 字节；
 * - salt 为空时生成 16 字节随机盐；
 * - 返回 { derivedKey, salt, iterations, algorithm } 的 base64url 编码；
 * - verifyDerivedKey 使用 timingSafeEqual 比较；
 * - 输入密码为空时抛错；
 * - iterations 必须是 10000-1_000_000 的整数，否则抛 RangeError。
 */
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
  // TODO
  throw new Error('TODO: deriveKey');
}

export async function verifyDerivedKey(
  password: string,
  stored: DerivedKey,
): Promise<boolean> {
  // TODO
  throw new Error('TODO: verifyDerivedKey');
}
