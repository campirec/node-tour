import { spawn } from 'node:child_process';
import { StringDecoder } from 'node:string_decoder';

/**
 * 练习 2：用 spawn 流式收集子进程 stdout 并按行拆分
 *
 * 场景：处理子进程的逐行输出（如日志流式读取、脚本逐行返回结果）。
 * execFile 会一次性缓冲全部输出，大输出下内存压力大且无法处理增量数据；
 * spawn 通过管道流式传输，配合 StringDecoder 可正确处理跨 chunk 的多字节字符。
 *
 * 函数签名
 *   collectLines(file: string, args: readonly string[], input?: string): Promise<string[]>
 *   - file：可执行文件路径
 *   - args：参数数组
 *   - input：可选的标准输入字符串，写完后立即关闭 stdin
 *   - 返回：按行拆分的字符串数组，不含换行符
 *
 * 示例
 *   collectLines(process.execPath, [fixture('print-lines.mjs')])
 *   => ['第一行', '第二行', '第三行']
 *
 *   collectLines(process.execPath, [fixture('echo-stdin.mjs')], 'hello\nworld')
 *   => ['HELLO', 'WORLD']
 *
 * 要求
 *   1. 使用 spawn（不是 exec），stdio 设为 ['pipe', 'pipe', 'pipe']；
 *   2. 用 StringDecoder 处理跨 chunk 的多字节字符（如中文），避免乱码；
 *   3. 按 '\n' 拆分行，去除行尾 '\r'；保留最后一行（即使没有换行符结尾）；
 *   4. 如有 input 参数，写入子进程 stdin 后调用 end() 关闭；
 *   5. 正常退出（code === 0）时 resolve 行数组；
 *   6. 非零退出码时 reject，错误信息包含 stderr 内容。
 *
 * 提示：子进程 close 事件触发时，stdout/stderr 的 data 事件已处理完毕，
 *       此时调用 decoder.end() flush 残留字符。
 */
export async function collectLines(
  file: string,
  args: readonly string[],
  input?: string,
): Promise<string[]> {
  // TODO: spawn + StringDecoder + close
  throw new Error('TODO: collectLines');
}
