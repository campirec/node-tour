import type { Readable } from 'node:stream';

/**
 * 练习 2：统计流的总字节数
 *
 * 场景：上传进度、流量计费、校验传输完整性。需要以字节为单位统计，
 * 而非字符数，且不能一次性把流读入内存。
 *
 * 函数签名
 *   countBytes(readable: Readable): Promise<number>
 *   - readable：可读流，chunk 可以是 Buffer 或 string
 *   - 返回：所有 chunk 累计的字节数（string chunk 按 UTF-8 编码计算）
 *
 * 示例
 *   countBytes(Readable.from(['你好', 'abc']))
 *   => 9  （'你好' 占 6 字节，'abc' 占 3 字节）
 *
 *   countBytes(Readable.from([]))
 *   => 0
 *
 *   countBytes(brokenReadable)  // 上游 this.destroy(new Error('磁盘读取失败'))
 *   => 返回的 Promise reject，错误消息为 '磁盘读取失败'
 *
 * 要求
 *   1. 使用 node:stream/promises 的 pipeline 串联可读流与自定义 Writable；
 *   2. 在 Writable.write 中累加 chunk.length，不要一次性读成字符串；
 *   3. 空流返回 0；
 *   4. 上游出错时 pipeline 必须 reject，错误向上传播。
 */
export async function countBytes(readable: Readable): Promise<number> {
  // TODO: new Writable({ write(chunk, encoding, callback) { ... } }) + pipeline
  throw new Error('TODO: countBytes');
}
