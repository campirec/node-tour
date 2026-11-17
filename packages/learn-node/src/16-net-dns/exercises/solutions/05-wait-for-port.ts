import { connect } from 'node:net';
import { setTimeout as sleep } from 'node:timers/promises';

export interface WaitForPortOptions {
  host?: string;
  timeoutMs?: number;
  intervalMs?: number;
}

function tryConnect(
  host: string,
  port: number,
  timeoutMs: number,
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const socket = connect({ host, port });
    let settled = false;
    let timer: NodeJS.Timeout | undefined;

    const finish = (action: () => void): void => {
      if (settled) {
        return;
      }
      settled = true;
      if (timer) {
        clearTimeout(timer);
      }
      socket.destroy();
      action();
    };

    timer = setTimeout(() => {
      finish(() => reject(new Error('连接超时')));
    }, timeoutMs);
    timer.unref();

    socket.once('connect', () => {
      finish(resolve);
    });
    socket.once('error', (error) => {
      finish(() => reject(error));
    });
  });
}

export async function waitForPort(
  port: number,
  options: WaitForPortOptions = {},
): Promise<void> {
  const host = options.host ?? '127.0.0.1';
  const timeoutMs = options.timeoutMs ?? 10_000;
  const intervalMs = options.intervalMs ?? 200;

  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new RangeError('port 必须是 1-65535 的整数');
  }
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) {
    throw new RangeError('timeoutMs 必须是正数');
  }
  if (!Number.isFinite(intervalMs) || intervalMs < 0) {
    throw new RangeError('intervalMs 必须是非负数');
  }

  const deadline = Date.now() + timeoutMs;

  for (;;) {
    const remaining = deadline - Date.now();
    if (remaining <= 0) {
      break;
    }

    try {
      await tryConnect(host, port, Math.min(remaining, 1000));
      return;
    } catch {
      const left = deadline - Date.now();
      if (left <= 0) {
        break;
      }
      await sleep(Math.min(intervalMs, left));
    }
  }

  throw new Error(`等待端口 ${host}:${port} 超时（${timeoutMs}ms）`);
}
