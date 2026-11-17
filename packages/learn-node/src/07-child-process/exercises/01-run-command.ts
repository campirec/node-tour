import { execFile, type ExecFileException } from 'node:child_process';
import { promisify } from 'node:util';

/**
 * 练习 1：封装 execFile。
 *
 * 为什么不用 exec？exec 会启动 shell，参数中的空格、引号、&、; 都可能变成命令注入。
 * execFile 直接执行可执行文件，参数作为数组传入，不经过 shell。
 *
 * 要求：
 * - 返回 { stdout, stderr }（UTF-8 字符串）；
 * - 非零退出、超时、超过 maxBuffer 时抛出 CommandError；
 * - CommandError 携带 exitCode、stdout、stderr，并保留原始错误作为 cause；
 * - Windows 下设置 windowsHide: true，避免弹出黑框。
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
