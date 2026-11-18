import { pbkdf2, randomBytes, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

/**
 * 企业级练习：PBKDF2 密钥派生与验证
 *
 * 场景：用户密码存储、API 密钥派生、主密码保护本地密钥。
 * PBKDF2 是 Node 内置的慢哈希，比 scrypt 更通用，比 argon2 无原生依赖。
 *
 * 函数签名
 *   deriveKey(password: string, salt?: Buffer, iterations?: number): Promise<DerivedKey>
 *   - password：密码，空串抛错
 *   - salt：盐；省略时生成 16 字节随机盐
 *   - iterations：迭代次数，默认 100_000，范围 10_000-1_000_000 的整数
 *   - 返回：{ derivedKey, salt, iterations, algorithm }，derivedKey/salt 为 base64url
 *
 *   verifyDerivedKey(password: string, stored: DerivedKey): Promise<boolean>
 *   - stored：deriveKey 返回的对象
 *   - 返回：密码匹配返回 true，否则 false
 *
 * 示例
 *   deriveKey('my-password')
 *   => { derivedKey: '<base64url>', salt: '<base64url>', iterations: 100000, algorithm: 'sha256' }
 *   deriveKey('my-password')  // 再次派生
 *   => derivedKey 与 salt 均不同（随机盐）
 *
 *   verifyDerivedKey('correct-password', stored)
 *   => true
 *   verifyDerivedKey('wrong-password', stored)
 *   => false
 *
 * 要求
 *   1. 使用 PBKDF2-HMAC-SHA256，默认 100_000 次迭代，输出 32 字节；
 *   2. salt 省略时生成 16 字节随机盐；
 *   3. 返回 { derivedKey, salt, iterations, algorithm }，derivedKey 与 salt 均 base64url；
 *   4. 相同 salt 与 iterations 派生相同密钥；
 *   5. verifyDerivedKey 使用 timingSafeEqual 比较；
 *   6. 空密码抛 Error('密码不能为空')；
 *   7. iterations 不是 10_000-1_000_000 的整数时抛 RangeError。
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
