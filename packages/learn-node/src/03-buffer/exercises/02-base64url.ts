/**
 * 练习 2：实现 URL 安全的 Base64 编解码
 *
 * 场景：标准 Base64 的 +、/、= 在 URL 路径、文件名、JWT 中需要转义，
 * base64url 用 - 替换 +、用 _ 替换 /，并去掉尾部 = 填充。
 *
 * 函数签名
 *   toBase64Url(input: Buffer | string): string
 *   - input：待编码的数据，Buffer 或 UTF-8 字符串
 *   - 返回：无填充的 base64url 字符串（仅含 [A-Za-z0-9_-]），空输入返回空串
 *
 *   fromBase64Url(value: string): Buffer
 *   - value：base64url 字符串，仅允许 [A-Za-z0-9_-]，不允许 + / = 等标准 Base64 字符
 *   - 返回：解码后的 Buffer
 *
 * 示例
 *   toBase64Url('hello')                    => 'aGVsbG8'
 *   toBase64Url('')                         => ''
 *   fromBase64Url(toBase64Url('你好，世界')).toString('utf8')
 *   => '你好，世界'
 *   fromBase64Url(toBase64Url(Buffer.from([0, 1, 2, 253, 254, 255])))
 *   => <Buffer 00 01 02 fd fe ff>
 *
 *   fromBase64Url('a+b/')                   => 抛 Error('非法 base64url 字符串')
 *   fromBase64Url('aGVsbG8=')               => 抛 Error('非法 base64url 字符串')
 *
 * 要求
 *   1. toBase64Url 接受 Buffer 或字符串（字符串按 UTF-8 编码），返回结果仅含
 *      [A-Za-z0-9_-]，不含 + / =；
 *   2. toBase64Url 空输入（空串或空 Buffer）返回空串；
 *   3. fromBase64Url 用正则校验字符集，仅允许 [A-Za-z0-9_-]；遇到 +、/、= 或
 *      其他非法字符时抛 Error('非法 base64url 字符串')；
 *   4. fromBase64Url 空串合法，返回空 Buffer；
 *   5. 编解码互逆：对任意 Buffer 或 UTF-8 字符串，
 *      fromBase64Url(toBase64Url(x)) 还原原始数据。
 */
export function toBase64Url(input: Buffer | string): string {
  // TODO: Buffer.from(input).toString('base64url')
  throw new Error('TODO: toBase64Url');
}

export function fromBase64Url(value: string): Buffer {
  // TODO: 先用正则校验字符集
  throw new Error('TODO: fromBase64Url');
}
