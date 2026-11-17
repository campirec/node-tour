import { Worker } from 'node:worker_threads';

export interface RunWorkerOptions {
  timeoutMs?: number;
}

export function runWorker<T = unknown>(
  workerUrl: URL | string,
  workerData: unknown,
  options: RunWorkerOptions = {},
): Promise<T> {
  const timeoutMs = options.timeoutMs ?? 5000;

  return new Promise<T>((resolve, reject) => {
    const worker = new Worker(workerUrl, { workerData });
    let timer: NodeJS.Timeout | undefined;
    let settled = false;

    const finish = (action: () => void): void => {
      if (settled) {
        return;
      }
      settled = true;
      if (timer) {
        clearTimeout(timer);
      }
      worker.removeAllListeners();
      action();
    };

    timer = setTimeout(() => {
      void worker.terminate();
      finish(() => reject(new Error(`Worker 超时（${timeoutMs}ms）`)));
    }, timeoutMs);
    timer.unref();

    worker.once('message', (message: T) => {
      finish(() => resolve(message));
    });
    worker.once('error', (error) => {
      finish(() => reject(error));
    });
    worker.once('exit', (code) => {
      if (code !== 0) {
        finish(() => reject(new Error(`Worker 退出码 ${code}`)));
      }
    });
  });
}
