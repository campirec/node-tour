import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

/**
 * 练习 1：使用 scrypt 存储密码。
 *
 * 绝不能用 SHA-256/MD5 直接存密码：它们太快，GPU 可以每秒尝试数十亿次。
 * 密码需要加盐 + 慢哈希（scrypt / argon2 / bcrypt）。
 *
 * 存储格式（自定义）：
 *   scrypt$<salt base64url>$<derivedKey base64url>
 *
 * 要求：
 * - 每次 hashPassword 使用 16 字节随机盐，因此同一密码两次结果不同；
 * - scrypt 输出 64 字节；
 * - verifyPassword 使用 timingSafeEqual 比较；
 * - 格式非法或算法不匹配时返回 false，而不是抛错；
 * - 空密码抛出错误。
 */
const scryptAsync = promisify(scrypt);
const KEY_LENGTH = 64;
const SCHEME = 'scrypt';

export async function hashPassword(password: string): Promise<string> {
  // TODO
  throw new Error('TODO: hashPassword');
}

export async function verifyPassword(
  password: string,
  stored: string,
): Promise<boolean> {
  // TODO
  throw new Error('TODO: verifyPassword');
}
