import { createHmac, timingSafeEqual } from 'node:crypto';

/**
 * 练习 3：Webhook 签名
 *
 * 场景：Webhook 回调验证。发送方用 HMAC-SHA256(secret, payload) 签名，
 * 接收方用同一 secret 重新计算并比较，必须用 timingSafeEqual 防时序攻击。
 *
 * 函数签名
 *   signPayload(payload: string, secret: string): string
 *   - payload：待签名的原始内容
 *   - secret：HMAC 密钥，空串抛错
 *   - 返回：64 位小写十六进制字符串
 *
 *   verifySignature(payload: string, signature: string, secret: string): boolean
 *   - payload：接收到的原始内容
 *   - signature：接收到的签名
 *   - secret：与签名时相同的密钥
 *   - 返回：签名匹配返回 true，否则 false
 *
 * 示例
 *   signPayload('The quick brown fox jumps over the lazy dog', 'key')
 *   => 'f7bc83f430538424b13298e6aa6fb143ef4d59a14946175997479dbc2d1a3cd8'
 *
 *   verifySignature('{"id":1}', signPayload('{"id":1}', 'topsecret'), 'topsecret')
 *   => true
 *   verifySignature('payload', 'abc', 'secret')  // 长度不匹配
 *   => false
 *
 * 要求
 *   1. signPayload 返回 HMAC-SHA256 的 64 位小写十六进制；
 *   2. secret 为空串时抛 Error('secret 不能为空')；
 *   3. verifySignature 用同一 secret 重新计算并比较；
 *   4. 签名长度不匹配时直接返回 false（不抛错）；
 *   5. payload、signature 或 secret 被篡改时返回 false；
 *   6. 使用 timingSafeEqual 比较，不用 ===。
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
