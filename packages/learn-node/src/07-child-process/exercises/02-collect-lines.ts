import { spawn } from 'node:child_process';
import { StringDecoder } from 'node:string_decoder';

/**
 * 练习 2：用 spawn 流式读取子进程输出，并按行拆分。
 *
 * 要求：
 * - 使用 spawn（不是 exec），stdout/stderr 走管道；
 * - 支持可选的标准输入（字符串），写完后关闭 stdin；
 * - 用 StringDecoder 处理跨 chunk 的中文；
 * - 保留最后一行（可能没有换行）；
 * - 非零退出码时 reject，错误信息包含 stderr。
 *
 * 提示：子进程 close 事件触发时，stdout/stderr 的 data 事件已经处理完毕。
 */
export async function collectLines(
  file: string,
  args: readonly string[],
  input?: string,
): Promise<string[]> {
  // TODO: spawn + StringDecoder + close
  throw new Error('TODO: collectLines');
}
