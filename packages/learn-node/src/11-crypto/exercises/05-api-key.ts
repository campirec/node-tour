import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';

/**
 * 企业级练习：API Key 生成、存储与校验
 *
 * 场景：开放平台/服务间调用。数据库只保存 hash，创建时一次性返回明文 token。
 *
 * 函数签名
 *   generateApiKey(prefix?: string): GeneratedApiKey
 *   - prefix：token 前缀，默认 'sk_live'，必须匹配 /^[a-z0-9_]{2,20}$/i
 *   - 返回：{ token, hash, prefix }
 *     token 格式 '<prefix>_<43位 base64url>'（随机部分 32 字节）
 *     hash 为 SHA-256 十六进制，prefix 为 token 前 12 个字符
 *
 *   hashApiKey(token: string): string
 *   - token：待哈希的 token，空串抛错
 *   - 返回：SHA-256 十六进制（64 位）
 *
 *   verifyApiKey(token: string, storedHash: string): boolean
 *   - storedHash：数据库存储的 hash
 *   - 返回：token 的 hash 与 storedHash 匹配返回 true，否则 false
 *
 * 示例
 *   generateApiKey('sk_test')
 *   => { token: 'sk_test_<43字符>', hash: '<64位hex>', prefix: 'sk_test_xxx' }
 *   verifyApiKey(key.token, key.hash)
 *   => true
 *   verifyApiKey(key.token, 'not-a-hash')
 *   => false（hash 格式非法）
 *
 * 要求
 *   1. token 随机部分为 32 字节，base64url 编码后 43 字符，token 格式 '<prefix>_<43字符>'；
 *   2. hashApiKey 使用 SHA-256 十六进制；
 *   3. verifyApiKey 使用 timingSafeEqual 比较；
 *   4. storedHash 格式非法（非 64 位十六进制）直接返回 false，不抛错；
 *   5. token 为空串时返回 false；
 *   6. hashApiKey 对空 token 抛 Error('token 不能为空')；
 *   7. prefix 不匹配 /^[a-z0-9_]{2,20}$/i 时抛 RangeError；
 *   8. prefix 取 token 前 12 个字符，用于后台展示。
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
