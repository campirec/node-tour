import type { Readable } from 'node:stream';

/**
 * 企业级练习：流式计算文件校验和。
 *
 * 场景：上传完成后核对 SHA-256、构建产物完整性、对象存储 ETag 校验。
 *
 * 要求：
 * - 使用 createHash + pipeline，不把整个流读入内存；
 * - 支持任意 Node 支持的摘要算法（默认 sha256）；
 * - 返回十六进制摘要；
 * - 上游错误向上传播；
 * - 空流也能返回对应算法的空摘要。
 */
export async function hashStream(
  readable: Readable,
  algorithm = 'sha256',
): Promise<string> {
  // TODO
  throw new Error('TODO: hashStream');
}
