import { spawn } from 'node:child_process';

export interface AbortableResult {
  stdout: string;
  stderr: string;
}

export async function runWithAbort(
  file: string,
  args: readonly string[],
  signal: AbortSignal,
): Promise<AbortableResult> {
  if (signal.aborted) {
    throw new Error('命令已取消');
  }

  return new Promise<AbortableResult>((resolve, reject) => {
    const child = spawn(file, [...args], {
      stdio: ['ignore', 'pipe', 'pipe'],
      windowsHide: true,
    });

    let stdout = '';
    let stderr = '';
    let settled = false;
    let forceKill: NodeJS.Timeout | undefined;

    const finish = (action: () => void): void => {
      if (settled) {
        return;
      }
      settled = true;
      signal.removeEventListener('abort', onAbort);
      if (forceKill) {
        clearTimeout(forceKill);
      }
      action();
    };

    const onAbort = (): void => {
      child.kill('SIGTERM');
      forceKill = setTimeout(() => {
        child.kill('SIGKILL');
      }, 200);
      forceKill.unref();
      finish(() => reject(new Error('命令已取消')));
    };

    signal.addEventListener('abort', onAbort, { once: true });

    child.stdout.on('data', (chunk: Buffer) => {
      stdout += chunk.toString('utf8');
    });
    child.stderr.on('data', (chunk: Buffer) => {
      stderr += chunk.toString('utf8');
    });

    child.on('error', (error) => {
      finish(() => reject(error));
    });

    child.on('close', (code, closeSignal) => {
      finish(() => {
        if (code === 0) {
          resolve({ stdout, stderr });
        } else {
          reject(
            new Error(
              `命令退出码 ${code ?? closeSignal ?? 'unknown'}: ${stderr.trim()}`,
            ),
          );
        }
      });
    });
  });
}
