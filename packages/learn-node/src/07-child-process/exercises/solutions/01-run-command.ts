import { execFile, type ExecFileException } from 'node:child_process';
import { promisify } from 'node:util';

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
  try {
    const { stdout, stderr } = await execFileAsync(file, [...args], {
      encoding: 'utf8',
      timeout: options.timeoutMs,
      maxBuffer: options.maxBuffer,
      windowsHide: true,
    });

    return {
      stdout: String(stdout),
      stderr: String(stderr),
    };
  } catch (error) {
    const execError = error as ExecFileException & {
      stdout?: string | Buffer;
      stderr?: string | Buffer;
    };

    throw new CommandError(`命令执行失败：${file}`, {
      exitCode: typeof execError.code === 'number' ? execError.code : null,
      stdout: execError.stdout ? String(execError.stdout) : '',
      stderr: execError.stderr ? String(execError.stderr) : '',
      cause: error,
    });
  }
}
