import { Readable, Writable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { createGzip, gunzip } from 'node:zlib';
import { promisify } from 'node:util';

/**
 * 企业级练习：JSON Lines 的 gzip 导入/导出。
 *
 * 场景：审计日志、事件归档、批量导出给数据团队。
 * 格式：每行一个 JSON 对象，整体 gzip。
 *
 * 要求：
 * - gzipJsonLines 用 Readable + createGzip + pipeline 生成 Buffer；
 * - 每条记录一行，JSON 序列化失败（undefined/循环引用）抛 TypeError；
 * - gunzipJsonLines 解压后逐行解析，跳过空行；
 * - 非法行错误包含行号与 cause；
 * - 空数组生成合法 gzip，解压后为 []；
 * - 非法 gzip 数据拒绝。
 */
export async function gzipJsonLines(
  records: readonly unknown[],
): Promise<Buffer> {
  // TODO
  throw new Error('TODO: gzipJsonLines');
}

export async function gunzipJsonLines<T = unknown>(
  data: Buffer,
): Promise<T[]> {
  // TODO
  throw new Error('TODO: gunzipJsonLines');
}
