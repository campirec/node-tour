import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const KEY_LENGTH = 32;

function assertKey(key: Buffer): void {
  if (key.length !== KEY_LENGTH) {
    throw new Error('AES-256 需要 32 字节密钥');
  }
}

export function encryptText(plaintext: string, key: Buffer): string {
  assertKey(key);
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const ciphertext = Buffer.concat([
    cipher.update(plaintext, 'utf8'),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();

  return [iv, tag, ciphertext]
    .map((buffer) => buffer.toString('base64url'))
    .join('.');
}

export function decryptText(payload: string, key: Buffer): string {
  assertKey(key);
  const parts = payload.split('.');
  if (parts.length !== 3) {
    throw new Error('密文格式错误');
  }

  const [ivPart, tagPart, dataPart] = parts as [string, string, string];
  const iv = Buffer.from(ivPart, 'base64url');
  const tag = Buffer.from(tagPart, 'base64url');
  const data = Buffer.from(dataPart, 'base64url');

  if (iv.length !== IV_LENGTH || tag.length !== 16) {
    throw new Error('密文格式错误');
  }

  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([
    decipher.update(data),
    decipher.final(),
  ]).toString('utf8');
}
