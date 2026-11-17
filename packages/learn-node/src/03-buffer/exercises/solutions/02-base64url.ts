export function toBase64Url(input: Buffer | string): string {
  return Buffer.from(input).toString('base64url');
}

export function fromBase64Url(value: string): Buffer {
  if (!/^[A-Za-z0-9_-]*$/.test(value)) {
    throw new Error('非法 base64url 字符串');
  }
  return Buffer.from(value, 'base64url');
}
