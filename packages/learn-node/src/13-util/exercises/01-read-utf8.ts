import { readFile } from 'node:fs';
import { promisify } from 'node:util';

/**
 * 练习 1：把回调式 API 包装成 Promise。
 *
 * 场景：接入旧库、Node 中仍是回调风格的 API（如某些 dns/zlib 方法）。
 *
 * 要求：
 * - 使用 util.promisify，不要手写 new Promise；
 * - readUtf8 返回 UTF-8 字符串；
 * - 文件不存在时保留 ENOENT 错误码。
 *
 * 进阶：思考 util.callbackify 如何做反向转换；以及 util.promisify.custom
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
