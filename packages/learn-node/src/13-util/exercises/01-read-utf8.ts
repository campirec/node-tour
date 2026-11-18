import { readFile } from 'node:fs';
import { promisify } from 'node:util';

/**
 * 练习 1：用 util.promisify 把回调式 readFile 包装成 Promise
 *
 * 场景：接入旧库或 Node 中仍是回调风格的 API。util.promisify 可以将
 * (err, result) 回调风格的函数自动转为返回 Promise 的函数。
 *
 * 函数签名
 *   readUtf8(filePath: string): Promise<string>
 *   - filePath：文件路径
 *   - 返回：文件内容的 UTF-8 字符串
 *
 * 示例
 *   readUtf8('/tmp/note.txt')  // 文件内容为 '你好，Node.js'
 *   => '你好，Node.js'
 *
 *   readUtf8('/tmp/missing.txt')
 *   => 拒绝，错误含 code: 'ENOENT'
 *
 * 要求
 *   1. 使用 util.promisify 包装 readFile，不要手写 new Promise；
 *   2. 以 UTF-8 编码读取文件，返回字符串；
 *   3. 文件不存在时保留原始 ENOENT 错误码，不捕获或改写。
 *
 * 提示：思考 util.callbackify 如何做反向转换；以及 util.promisify.custom
 * 如何为特殊 API 定制返回值。
 */
const readFileAsync = promisify(readFile) as (
  path: string,
  encoding: BufferEncoding,
) => Promise<string>;

export async function readUtf8(filePath: string): Promise<string> {
  // TODO
  throw new Error('TODO: readUtf8');
}
