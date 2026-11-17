import { createHmac, timingSafeEqual } from 'node:crypto';

/**
 * 企业级练习：生成与校验带过期时间的签名 URL。
 *
 * 场景：私有文件下载、CDN 临时访问、邀请链接、内部服务回调。
 *
 * 签名内容（防止篡改路径、方法或延期）：
 *   METHOD \n pathname \n expires
 *
 * 要求：
 * - createSignedUrl 写入 expires（秒级时间戳）与 signature（base64url）；
 * - verifySignedUrl 返回 { valid, reason }，不抛业务错误；
 * - reason: missing / invalid / expired / signature；
 * - 使用 timingSafeEqual 比较签名；
 * - now 可注入（秒），便于测试；
 * - secret 为空时抛错；非法 URL 让 URL 构造器抛错。
 *
 * 注意：如果要保护 query 中的业务参数，应把它们按稳定顺序纳入签名。
 */
export interface CreateSignedUrlOptions {
  method?: string;
  expiresInSeconds?: number;
  now?: () => number;
}

export interface VerifySignedUrlOptions {
  method?: string;
  now?: () => number;
}

export type VerifyFailureReason = 'missing' | 'invalid' | 'expired' | 'signature';

export interface VerifyResult {
  valid: boolean;
  reason?: VerifyFailureReason;
}

export function createSignedUrl(
  url: string,
  secret: string,
  options: CreateSignedUrlOptions = {},
): string {
  // TODO
  throw new Error('TODO: createSignedUrl');
}

export function verifySignedUrl(
  url: string,
  secret: string,
  options: VerifySignedUrlOptions = {},
): VerifyResult {
  // TODO
  throw new Error('TODO: verifySignedUrl');
}
