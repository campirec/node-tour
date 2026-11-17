import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';

/**
 * 练习 2：AES-256-GCM 加密与解密。
 *
 * 格式：<iv base64url>.<authTag base64url>.<ciphertext base64url>
 *
 * 要求：
 * - key 必须是 32 字节；否则抛出错误；
 * - 每次加密使用 12 字节随机 IV（GCM 的推荐长度，绝不能复用）；
 * - 使用 authTag 检测篡改；
 * - 解密失败（密钥错误、数据被改）让 crypto 抛错，不要吞掉；
 * - 支持中文与空字符串。
 */
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;

export function encryptText(plaintext: string, key: Buffer): string {
  // TODO
  throw new Error('TODO: encryptText');
}

export function decryptText(payload: string, key: Buffer): string {
  // TODO
  throw new Error('TODO: decryptText');
}
