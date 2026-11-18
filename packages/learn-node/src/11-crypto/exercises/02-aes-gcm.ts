import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';

/**
 * 练习 2：AES-256-GCM 加密与解密
 *
 * 场景：加密数据库字段、本地文件、会话 token。GCM 模式同时提供
 * 机密性与完整性（authTag 检测篡改）。
 *
 * 函数签名
 *   encryptText(plaintext: string, key: Buffer): string
 *   - plaintext：明文，支持中文与空字符串
 *   - key：AES-256 密钥，必须 32 字节
 *   - 返回：'<iv base64url>.<authTag base64url>.<ciphertext base64url>'
 *
 *   decryptText(payload: string, key: Buffer): string
 *   - payload：encryptText 返回的密文字符串
 *   - key：同上，必须 32 字节
 *   - 返回：解密后的明文
 *
 * 示例
 *   encryptText('你好，Node.js', key)
 *   => '<base64url>.<base64url>.<base64url>'（3 段以 . 分隔）
 *   encryptText('same', key)  // 相同明文
 *   => 每次密文不同（随机 IV）
 *   decryptText(encryptText('', key), key)
 *   => ''（空串往返）
 *
 * 要求
 *   1. key 长度不是 32 字节时抛 Error（消息含 '32 字节'）；
 *   2. 每次加密使用 12 字节随机 IV，不可复用；
 *   3. 密文格式为 iv.authTag.ciphertext，均 base64url 编码；
 *   4. 使用 authTag 检测篡改：密文或 tag 被改时解密抛错，不吞错；
 *   5. 密钥错误时解密抛错（authTag 校验失败）；
 *   6. payload 不是 3 段或 iv/tag 长度不对时抛 Error('密文格式错误')；
 *   7. 支持中文与空字符串。
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
