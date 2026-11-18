/**
 * 企业级练习：带指数退避重试的命令执行
 *
 * 场景：迁移脚本、外部 CLI、部署钩子偶发失败（网络抖动、锁竞争、临时资源不足）。
 * 自动重试 + 指数退避可提高成功率，但只有幂等命令才适合自动重试。
 *
 * 函数签名
 *   runCommandWithRetry(file: string, args: readonly string[], options?: RetryCommandOptions): Promise<CommandResult>
 *   - file：可执行文件路径
 *   - args：参数数组
 *   - options.retries：重试次数，默认 2（总执行 retries+1 次）
 *   - options.baseDelayMs：首次退避毫秒数，默认 100，每次翻倍
 *   - options.timeoutMs：单次执行超时
 *   - options.maxBuffer：stdout/stderr 最大字节数
 *   - options.signal：AbortSignal，中止后立即停止不再重试
 *   - 返回：{ stdout, stderr }，均为 UTF-8 字符串
 *
 * 示例
 *   // 第三次成功
 *   runCommandWithRetry(process.execPath, [fixture('flaky.mjs'), counter, '3'],
 *     { retries: 3, baseDelayMs: 1 })
 *   => { stdout: 'attempt 3 ok\n' }
 *
 *   // 用尽重试
 *   runCommandWithRetry(process.execPath, [fixture('fail.mjs')], { retries: 2, baseDelayMs: 1 })
 *   => 抛 CommandRetryError，attempts = 3，exitCode = 3，stderr = 'boom\n'
 *
 * 要求
 *   1. 使用 execFile（不经过 shell），encoding 设为 'utf8'，windowsHide: true；
 *   2. 最多执行 retries+1 次，退避间隔 = baseDelayMs * 2^(attempt-1)；
 *   3. retries 必须是 >= 0 的整数，否则抛 RangeError；
 *   4. baseDelayMs 必须是 >= 0 的有限数，否则抛 RangeError；
 *   5. AbortSignal 中止后立即停止、不再重试，抛出 signal.reason（AbortError）；
 *   6. 最终全部失败时抛 CommandRetryError，携带 attempts（总执行次数）、
 *      exitCode（数字或 null）、stdout、stderr、cause；
 *   7. CommandRetryError.name 必须为 'CommandRetryError'。
 */
export interface CommandResult {
  stdout: string;
  stderr: string;
}

export class CommandRetryError extends Error {
  readonly attempts: number;
  readonly exitCode: number | null;
  readonly stdout: string;
  readonly stderr: string;

  constructor(
    message: string,
    options: {
      attempts: number;
      exitCode: number | null;
      stdout: string;
      stderr: string;
      cause?: unknown;
    },
  ) {
    super(message, { cause: options.cause });
    this.name = 'CommandRetryError';
    this.attempts = options.attempts;
    this.exitCode = options.exitCode;
    this.stdout = options.stdout;
    this.stderr = options.stderr;
  }
}

export interface RetryCommandOptions {
  retries?: number;
  baseDelayMs?: number;
  timeoutMs?: number;
  maxBuffer?: number;
  signal?: AbortSignal;
}

export async function runCommandWithRetry(
  file: string,
  args: readonly string[],
  options: RetryCommandOptions = {},
): Promise<CommandResult> {
  // TODO
  throw new Error('TODO: runCommandWithRetry');
}
