import type { Readable } from 'node:stream';

/**
 * 企业级练习：流式计算文件校验和
 *
 * 场景：上传完成后核对 SHA-256、构建产物完整性校验、对象存储 ETag 比对。
 * 需要流式处理，不能把整个文件读入内存。
 *
 * 函数签名
 *   hashStream(readable: Readable, algorithm?: string): Promise<string>
 *   - readable：可读流，chunk 可以是 Buffer 或 string
 *   - algorithm：摘要算法，默认 'sha256'（任意 Node 支持的算法均可）
 *   - 返回：十六进制摘要字符串
 *
 * 示例
 *   hashStream(Readable.from(['hello']))
 *   => '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824'
 *
 *   hashStream(Readable.from(['he', 'll', 'o']))  // 切分方式不影响结果
 *   => 同上
 *
 *   hashStream(Readable.from([]))  // 空流
 *   => createHash('sha256').digest('hex')  （空内容摘要）
 *
 *   hashStream(Readable.from(['x']), 'not-a-hash')
 *   => rejects
 *
 * 要求
 *   1. 使用 createHash + pipeline，不把整个流读入内存；
 *   2. 支持任意 Node 支持的摘要算法，默认 sha256；
 *   3. 返回十六进制摘要，与 chunk 切分方式无关；
 *   4. 空流返回对应算法的空内容摘要（非空字符串）；
 *   5. 非法算法名时 reject；
 *   6. 上游错误向上传播（reject 且错误消息一致）。
 */
export async function hashStream(
  readable: Readable,
  algorithm = 'sha256',
): Promise<string> {
  // TODO
  throw new Error('TODO: hashStream');
}
