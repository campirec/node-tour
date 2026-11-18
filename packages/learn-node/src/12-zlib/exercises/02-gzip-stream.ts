import type { Readable } from 'node:stream';

/**
 * 练习 2：流式 gzip 压缩
 *
 * 场景：大文件或持续数据流的压缩，不能先把全部内容读入内存再压缩。
 * 需要用 pipeline 把 readable → createGzip → Writable 串联，边读边压。
 *
 * 函数签名
 *   gzipStream(readable: Readable): Promise<Buffer>
 *   - readable：任意可读流，可能分多个 chunk 推送数据
 *   - 返回：完整 gzip 格式 Buffer
 *
 * 示例
 *   gzipStream(Readable.from(['hello ', 'world']))
 *   => Buffer（可被 gunzip 还原为 'hello world'）
 *
 *   gzipStream(Readable.from([]))
 *   => 合法 gzip Buffer（解压后为空串）
 *
 *   gzipStream(brokenStream)  // 上游 destroy(new Error('source failed'))
 *   => 拒绝并抛 'source failed'
 *
 * 要求
 *   1. 使用 pipeline(readable, createGzip(), collector) 串联，不要先读到内存再压缩；
 *   2. collector 为自定义 Writable，收集所有 chunk 后用 Buffer.concat 返回；
 *   3. 空流也产生合法 gzip Buffer，解压后为空字符串；
 *   4. 上游流发生错误时，通过 pipeline reject，错误消息原样传播。
 */
export async function gzipStream(readable: Readable): Promise<Buffer> {
  // TODO
  throw new Error('TODO: gzipStream');
}
