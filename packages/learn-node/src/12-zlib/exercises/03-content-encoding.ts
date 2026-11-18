import { brotliCompress, gzip } from 'node:zlib';
import { promisify } from 'node:util';

/**
 * 练习 3：根据 Accept-Encoding 选择压缩算法
 *
 * 场景：HTTP 响应压缩协商。服务端读取请求头 Accept-Encoding，按客户端偏好
 * 和 q 值选择最优编码（br / gzip / identity），返回压缩后的 body。
 *
 * 函数签名
 *   compressForEncoding(text: string, acceptEncoding: string): Promise<CompressedPayload>
 *   - text：待压缩的原始文本
 *   - acceptEncoding：Accept-Encoding 头值，如 'gzip, br;q=0.8, *;q=0.1'
 *   - 返回：{ encoding, body }，encoding 为 'br' | 'gzip' | 'identity'，
 *     body 为对应编码的 Buffer（identity 时为原文 UTF-8 Buffer）
 *
 * 示例
 *   compressForEncoding(text, 'gzip, br')
 *   => { encoding: 'br', body: <Brotli Buffer> }（br 与 gzip 同 q 值时优先 br）
 *
 *   compressForEncoding(text, 'gzip;q=1, br;q=0.5')
 *   => { encoding: 'gzip', body: <gzip Buffer> }
 *
 *   compressForEncoding(text, 'gzip, identity')
 *   => { encoding: 'gzip', body: <gzip Buffer> }（q 相同时 identity 优先级最低）
 *
 *   compressForEncoding(text, 'br;q=0')
 *   => { encoding: 'identity', body: <原文 Buffer> }（q=0 表示不可接受）
 *
 *   compressForEncoding(text, '')
 *   => { encoding: 'identity', body: <原文 Buffer> }（没有可接受编码时回退 identity）
 *
 *   compressForEncoding(text, '*')
 *   => { encoding: 'br', body: <Brotli Buffer> }（通配符让 br 命中）
 *
 * 要求
 *   1. 按逗号切分头值，解析 '编码名;q=值'；缺省 q=1，q 超出 0-1 时截断；
 *   2. 支持的编码集合为 br / gzip / identity，其他编码名忽略；
 *   3. br 与 gzip 的 q 值优先级：显式声明 > 通配符 '*' > 视为 0（不可接受）；
 *   4. identity 的 q 值只取显式声明，缺省为 1，不受通配符影响；
 *   5. 在 q > 0 的候选中选 q 最大的；q 相同时按 br > gzip > identity 排序；
 *   6. 头值为空串、或没有任何 q > 0 的候选时，返回 identity 与原文 UTF-8 Buffer；
 *   7. acceptEncoding 必须是字符串（请求缺少该头时由调用方传空串），
 *      传入非字符串会在调用 split 时抛 TypeError。
 *
 * 提示：只需做支持集合内的协商，不需要覆盖 RFC 全部细节。
 */
export type ContentEncoding = 'gzip' | 'br' | 'identity';

export interface CompressedPayload {
  encoding: ContentEncoding;
  body: Buffer;
}

export async function compressForEncoding(
  text: string,
  acceptEncoding: string,
): Promise<CompressedPayload> {
  // TODO
  throw new Error('TODO: compressForEncoding');
}
