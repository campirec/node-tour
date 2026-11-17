import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';

/**
 * 企业级练习：API Key 生成、存储与校验。
 *
 * 场景：开放平台/服务间调用。数据库只保存 hash，创建时一次性返回明文 token。
 *
 * 要求：
 * - token 格式：<prefix>_<43 位 base64url 随机串>，随机部分 32 字节；
 * - generateApiKey 返回 { token, hash, prefix }；
 * - hashApiKey 使用 SHA-256 十六进制；
 * - verifyApiKey 对格式非法的 storedHash 直接返回 false，不抛错；
 * - 使用 timingSafeEqual 比较；
 * - prefix 只保留 token 前 12 个字符，用于后台展示；
 * - prefix 必须匹配 /^[a-z0-9_]{2,20}$/i。
 */
export interface GeneratedApiKey {
  token: string;
  hash: string;
  prefix: string;
}

export function generateApiKey(prefix = 'sk_live'): GeneratedApiKey {
  // TODO
  throw new Error('TODO: generateApiKey');
}

export function hashApiKey(token: string): string {
  // TODO
  throw new Error('TODO: hashApiKey');
}

export function verifyApiKey(token: string, storedHash: string): boolean {
  // TODO
  throw new Error('TODO: verifyApiKey');
}
