import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

/**
 * 练习 1：使用 scrypt 存储密码
 *
 * 场景：SHA-256/MD5 太快，GPU 每秒可尝试数十亿次。密码需要加盐 +
 * 慢哈希（scrypt），数据库只存格式化后的字符串。
 *
 * 函数签名
 *   hashPassword(password: string): Promise<string>
 *   - password：明文密码，空串抛错
 *   - 返回：'scrypt$<salt base64url>$<derivedKey base64url>'
 *
 *   verifyPassword(password: string, stored: string): Promise<boolean>
 *   - password：待验证的明文
 *   - stored：hashPassword 返回的存储字符串
 *   - 返回：密码匹配返回 true，格式非法或密码错误返回 false
 *
 * 示例
 *   hashPassword('correct horse battery staple')
 *   => 'scrypt$<base64url盐>$<base64url 64字节密钥>'
 *   hashPassword('correct horse battery staple')  // 同一密码再次哈希
 *   => 与上次结果不同（随机盐）
 *
 *   verifyPassword('correct horse battery staple', stored)
 *   => true
 *   verifyPassword('wrong', stored)
 *   => false
 *   verifyPassword('x', '')
 *   => false（格式非法）
 *
 * 要求
 *   1. 每次 hashPassword 使用 16 字节随机盐，同一密码两次结果不同；
 *   2. scrypt 输出 64 字节，盐与密钥均用 base64url 编码；
 *   3. verifyPassword 使用 timingSafeEqual 比较；
 *   4. 格式非法（非 3 段、算法不匹配、盐为空、密钥长度不对）返回 false，不抛错；
 *   5. 空密码抛 Error('密码不能为空')。
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
