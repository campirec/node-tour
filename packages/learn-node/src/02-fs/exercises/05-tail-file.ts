import { open } from 'node:fs/promises';

/**
 * 企业级练习：读取大日志文件的最后 N 行。
 *
 * 场景：管理端点查看最近错误、部署失败时展示日志尾部。
 * 不能把 10GB 日志整个 readFile 进内存。
 *
 * 要求：
 * - 使用 FileHandle 从文件尾部按 maxBytes 读取；
 * - 只返回完整行，不能把截断的半行当成一行；
 * - 支持 \n 与 \r\n；
 * - 文件小于 maxBytes 时读取全部；
 * - count 必须是正整数，maxBytes 必须是正数；
 * - 文件不存在时保留 ENOENT。
 */
export async function readLastLines(
  filePath: string,
  count: number,
  maxBytes = 64 * 1024,
): Promise<string[]> {
  // TODO
  throw new Error('TODO: readLastLines');
}
