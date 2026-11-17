import { createHmac, timingSafeEqual } from 'node:crypto';

/**
 * 练习 3：Webhook 签名。
 *
 * 发送方：signature = HMAC-SHA256(secret, payload).hex()
 * 接收方：用同一 secret 重新计算，并用 timingSafeEqual 比较。
 *
 * 要求：
 * - signPayload 返回 64 位小写十六进制；
 * - secret 为空时抛出错误；
 * - verifySignature 长度不同直接返回 false（timingSafeEqual 长度不同会抛错）；
 * - 签名内容或 payload 被篡改时返回 false；
 * - 不要用 === 比较签名，避免时序攻击。
 */
export function signPayload(payload: string, secret: string): string {
  // TODO
  throw new Error('TODO: signPayload');
}

export function verifySignature(
  payload: string,
  signature: string,
  secret: string,
): boolean {
  // TODO
  throw new Error('TODO: verifySignature');
}
