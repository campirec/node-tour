import { execFile, type ExecFileException } from 'node:child_process';
import { promisify } from 'node:util';

/**
 * 练习 1：用 execFile 安全执行外部命令
 *
 * 场景：调用 CLI 工具、运行构建脚本、执行系统命令。exec 会启动 shell，
 * 参数中的空格、引号、&、; 都可能变成命令注入；execFile 直接执行可执行文件，
 * 参数以数组传入，不经 shell，从根本上杜绝注入。
 *
 * 函数签名
 *   runCommand(file: string, args: readonly string[], options?: RunCommandOptions): Promise<CommandResult>
 *   - file：可执行文件路径，如 process.execPath
 *   - args：参数数组，每个元素是一个独立参数
 *   - options.timeoutMs：超时毫秒数，到期终止子进程
 *   - options.maxBuffer：stdout/stderr 最大字节数，超出则失败
 *   - 返回：{ stdout, stderr }，均为 UTF-8 字符串
 *
 * 示例
 *   runCommand(process.execPath, ['-e', 'console.log("你好"); console.error("warn")'])
 *   => { stdout: '你好\n', stderr: 'warn\n' }
 *
 *   runCommand(process.execPath, [fixture('fail.mjs')])
 *   => 抛 CommandError，exitCode = 3，stderr = 'boom\n'
 *
 * 要求
 *   1. 使用 execFile（promisify），encoding 设为 'utf8'，Windows 下 windowsHide: true；
 *   2. 成功时返回 { stdout, stderr }，两者均为字符串；
 *   3. 非零退出码时抛 CommandError，携带 exitCode（数字或 null）、stdout、stderr，
 *      并以 options.cause 保留原始 ExecFileException；
 *   4. 超时（timeoutMs 到期）和超过 maxBuffer 时同样抛 CommandError；
 *   5. CommandError.name 必须为 'CommandError'。
 */
export interface CommandResult {
  stdout: string;
  stderr: string;
}

export class CommandError extends Error {
  readonly exitCode: number | null;
  readonly stdout: string;
  readonly stderr: string;

  constructor(
    message: string,
    options: {
      exitCode: number | null;
      stdout: string;
      stderr: string;
      cause?: unknown;
    },
  ) {
    super(message, { cause: options.cause });
    this.name = 'CommandError';
    this.exitCode = options.exitCode;
    this.stdout = options.stdout;
    this.stderr = options.stderr;
  }
}

export interface RunCommandOptions {
  timeoutMs?: number;
  maxBuffer?: number;
}

const execFileAsync = promisify(execFile);

export async function runCommand(
  file: string,
  args: readonly string[],
  options: RunCommandOptions = {},
): Promise<CommandResult> {
  // TODO: execFileAsync + CommandError
  throw new Error('TODO: runCommand');
}
