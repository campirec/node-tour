import { Readable, Writable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { createGzip, gunzip } from 'node:zlib';
import { promisify } from 'node:util';

/**
 * 企业级练习：JSON Lines 的 gzip 导入/导出
 *
 * 场景：审计日志、事件归档、批量导出给数据团队。格式为每行一个 JSON 对象，
 * 整体 gzip 压缩。需要能正向生成压缩 Buffer，也能逆向解压并逐行解析还原。
 *
 * 函数签名
 *   gzipJsonLines(records: readonly unknown[]): Promise<Buffer>
 *   - records：待导出的记录数组，每条记录会被 JSON.stringify 为一行
 *   - 返回：gzip 格式 Buffer，以 0x1f 0x8b 开头
 *
 *   gunzipJsonLines<T>(data: Buffer): Promise<T[]>
 *   - data：gzip 格式的 JSON Lines Buffer
 *   - 返回：解析后的对象数组
 *
 * 示例
 *   gzipJsonLines([{ id: 1, name: '张三' }, { id: 2, name: '李四' }])
 *   => Buffer（0x1f 0x8b 开头）
 *   gunzipJsonLines(result) => [{ id: 1, name: '张三' }, { id: 2, name: '李四' }]
 *
 *   gunzipJsonLines(gzip压缩的 '{"a":1}\n\n{"a":2}\n')
 *   => [{ a: 1 }, { a: 2 }]（跳过空行）
 *
 *   gunzipJsonLines(gzip压缩的 '{"ok":true}\nnot-json\n')
 *   => 拒绝，错误消息含 '第 2 行'，cause 为 SyntaxError
 *
 * 要求
 *   1. gzipJsonLines 用 Readable + createGzip + pipeline 生成 Buffer，每条记录一行；
 *   2. JSON.stringify 返回 undefined 的记录（如 undefined 本身）抛 TypeError，
 *      错误消息包含 1-based 的记录序号；
 *   3. 空数组生成合法 gzip Buffer，解压后返回空数组 []；
 *   4. gunzipJsonLines 解压后逐行 JSON.parse，跳过空行（仅空白）；
 *   5. 非法 JSON 行抛 Error，消息包含 1-based 行号，cause 为对应 SyntaxError；
 *   6. 传入非合法 gzip 数据调用 gunzipJsonLines 时拒绝，让 zlib 错误传播。
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
