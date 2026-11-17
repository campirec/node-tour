import { execFile, type ExecFileException } from 'node:child_process';
import { promisify } from 'node:util';
import { setTimeout as sleep } from 'node:timers/promises';

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

const execFileAsync = promisify(execFile);

export async function runCommandWithRetry(
  file: string,
  args: readonly string[],
  options: RetryCommandOptions = {},
): Promise<CommandResult> {
  const retries = options.retries ?? 2;
  const baseDelayMs = options.baseDelayMs ?? 100;

  if (!Number.isInteger(retries) || retries < 0) {
    throw new RangeError('retries 必须是 >= 0 的整数');
  }
  if (!Number.isFinite(baseDelayMs) || baseDelayMs < 0) {
    throw new RangeError('baseDelayMs 必须是 >= 0 的数字');
  }

  let lastError:
    | (ExecFileException & {
        stdout?: string | Buffer;
        stderr?: string | Buffer;
      })
    | undefined;

  for (let attempt = 1; attempt <= retries + 1; attempt += 1) {
    if (options.signal?.aborted) {
      throw options.signal.reason;
    }

    try {
      const { stdout, stderr } = await execFileAsync(file, [...args], {
        encoding: 'utf8',
        timeout: options.timeoutMs,
        maxBuffer: options.maxBuffer,
        signal: options.signal,
        windowsHide: true,
      });
      return {
        stdout: String(stdout),
        stderr: String(stderr),
      };
    } catch (error) {
      lastError = error as typeof lastError;
      if (options.signal?.aborted) {
        throw error;
      }
      if (attempt <= retries) {
        await sleep(
          baseDelayMs * 2 ** (attempt - 1),
          undefined,
          options.signal ? { signal: options.signal } : undefined,
        );
      }
    }
  }

  throw new CommandRetryError(
    `命令执行失败（已尝试 ${retries + 1} 次）：${file}`,
    {
      attempts: retries + 1,
      exitCode:
        typeof lastError?.code === 'number' ? lastError.code : null,
      stdout: lastError?.stdout ? String(lastError.stdout) : '',
      stderr: lastError?.stderr ? String(lastError.stderr) : '',
      cause: lastError,
    },
  );
}
