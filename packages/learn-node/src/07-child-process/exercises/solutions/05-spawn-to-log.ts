import { createWriteStream } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import { spawn } from 'node:child_process';
import { finished } from 'node:stream/promises';

export interface RunToLogOptions {
  logPath: string;
  timeoutMs?: number;
  cwd?: string;
}

export interface RunToLogResult {
  exitCode: number;
  logPath: string;
}

export async function runToLog(
  file: string,
  args: readonly string[],
  options: RunToLogOptions,
): Promise<RunToLogResult> {
  if (!options.logPath) {
    throw new RangeError('logPath 不能为空');
  }
  if (
    options.timeoutMs !== undefined &&
    (!Number.isFinite(options.timeoutMs) || options.timeoutMs <= 0)
  ) {
    throw new RangeError('timeoutMs 必须是正数');
  }

  await mkdir(dirname(options.logPath), { recursive: true });
  const logStream = createWriteStream(options.logPath, { flags: 'w' });

  return new Promise<RunToLogResult>((resolve, reject) => {
    const child = spawn(file, [...args], {
      cwd: options.cwd,
      stdio: ['ignore', 'pipe', 'pipe'],
      windowsHide: true,
    });

    let settled = false;
    let timer: NodeJS.Timeout | undefined;

    const finish = async (exitCode: number, error?: unknown): Promise<void> => {
      if (settled) {
        return;
      }
      settled = true;
      if (timer) {
        clearTimeout(timer);
      }

      child.stdout.unpipe(logStream);
      child.stderr.unpipe(logStream);
      logStream.end();

      try {
        await finished(logStream);
      } catch (logError) {
        if (!error) {
          error = logError;
        }
      }

      if (error) {
        reject(error);
      } else {
        resolve({ exitCode, logPath: options.logPath });
      }
    };

    logStream.once('error', (error) => {
      child.kill('SIGTERM');
      void finish(1, error);
    });

    child.stdout.pipe(logStream, { end: false });
    child.stderr.pipe(logStream, { end: false });

    child.once('error', (error) => {
      void finish(1, error);
    });
    child.once('close', (code, signal) => {
      void finish(
        code ?? (signal ? 1 : 0),
        code === null && signal ? new Error(`命令被信号 ${signal} 终止`) : undefined,
      );
    });

    if (options.timeoutMs !== undefined) {
      timer = setTimeout(() => {
        child.kill('SIGTERM');
        void finish(1, new Error(`命令超时（${options.timeoutMs}ms）`));
      }, options.timeoutMs);
      timer.unref();
    }
  });
}
