/**
 * 企业级练习：带退避重试的命令执行。
 *
 * 场景：迁移脚本、外部 CLI、部署钩子偶发失败（网络、锁竞争、临时资源不足）。
 *
 * 要求：
 * - 使用 execFile，不经过 shell；
 * - 最多执行 retries+1 次，指数退避 baseDelayMs * 2^(attempt-1)；
 * - 支持 timeoutMs、maxBuffer、AbortSignal；
 * - signal 中止后立即停止，不再重试；
 * - 最终失败抛 CommandRetryError，携带 attempts、exitCode、stdout、stderr 与 cause。
 *
 * 注意：只有幂等命令才适合自动重试。
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
