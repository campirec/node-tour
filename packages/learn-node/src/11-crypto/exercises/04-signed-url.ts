import { createHmac, timingSafeEqual } from 'node:crypto';

/**
 * 企业级练习：生成与校验带过期时间的签名 URL
 *
 * 场景：私有文件下载、CDN 临时访问、邀请链接、内部服务回调。
 * 通过 HMAC 签名防止篡改路径或方法，通过 expires 防止延期使用。
 *
 * 函数签名
 *   createSignedUrl(url, secret, options?): string
 *   - url：原始 URL（必须是绝对 URL，否则 URL 构造器抛 TypeError）
 *   - secret：签名密钥，空串抛 Error
 *   - options.method：HTTP 方法，默认 GET（大小写不敏感，签名时转大写）
 *   - options.expiresInSeconds：过期秒数，默认 300，正整数
 *   - options.now：时间注入函数，返回秒级时间戳
 *   - 返回：追加 expires 与 signature 查询参数的 URL
 *
 *   verifySignedUrl(url, secret, options?): VerifyResult
 *   - 返回：{ valid: boolean, reason?: 'missing'|'invalid'|'expired'|'signature' }
 *
 * 示例（now() = 1_000_000, expiresInSeconds = 10）
 *   createSignedUrl('https://files.test/reports/2026.pdf?download=1', SECRET, {...})
 *   => expires = 1_000_010, signature = base64url
 *   verifySignedUrl(signed, SECRET, { now })  => { valid: true }
 *   time.advance(10)
 *   verifySignedUrl(signed, SECRET, { now })  => { valid: false, reason: 'expired' }
 *
 * 要求
 *   1. 签名内容为 'METHOD\npathname\nexpires'，HMAC-SHA256 base64url；
 *   2. createSignedUrl 向 URL 追加 expires（秒级时间戳）与 signature 查询参数；
 *   3. 原有查询参数（如 download=1）保留；
 *   4. verifySignedUrl 返回 { valid, reason }，不抛业务错误：
 *      missing = 缺少 expires 或 signature 参数；
 *      invalid = expires 不是整数或为负数；
 *      expired = expires <= now；
 *      signature = 签名不匹配；
 *   5. 使用 timingSafeEqual 比较签名，长度不匹配时返回 signature 失败；
 *   6. secret 为空串时抛 Error('secret 不能为空')；
 *   7. expiresInSeconds 非正整数时抛 RangeError；非绝对 URL 让 URL 构造器抛 TypeError。
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
