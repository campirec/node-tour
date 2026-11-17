/**
 * 练习 2：实现 URL 安全的 Base64。
 *
 * Base64 的 + / = 在 URL、文件名、JWT 中需要转义。
 * base64url 用 - 替换 +、用 _ 替换 /，并去掉尾部 =。
 *
 * 要求：
 * - toBase64Url 接受 Buffer 或字符串（按 UTF-8）；
 * - fromBase64Url 校验字符集，拒绝标准 Base64 的 + / =；
 * - 空字符串合法，返回空 Buffer。
 */
export function toBase64Url(input: Buffer | string): string {
  // TODO: Buffer.from(input).toString('base64url')
  throw new Error('TODO: toBase64Url');
}

export function fromBase64Url(value: string): Buffer {
  // TODO: 先用正则校验字符集
  throw new Error('TODO: fromBase64Url');
}
