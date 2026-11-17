import { Worker } from 'node:worker_threads';

export interface WorkerProgress {
  done: number;
  total: number;
}

type WorkerMessage =
  | { type: 'progress'; done: number; total: number }
  | { type: 'result'; value: unknown };

export async function runWorkerWithProgress<T = unknown>(
  workerUrl: URL | string,
  workerData: unknown,
  onProgress: (progress: WorkerProgress) => void,
  timeoutMs = 5000,
): Promise<T> {
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) {
    throw new RangeError('timeoutMs 必须是正数');
  }
  if (typeof onProgress !== 'function') {
    throw new TypeError('onProgress 必须是函数');
  }

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
      finish(() =>
        reject(new Error(`Worker 超时（${timeoutMs}ms）`)),
      );
    }, timeoutMs);
    timer.unref();

    worker.on('message', (message: WorkerMessage) => {
      if (message.type === 'progress') {
        try {
          onProgress({ done: message.done, total: message.total });
        } catch (error) {
          void worker.terminate();
          finish(() => reject(error));
        }
        return;
      }

      if (message.type === 'result') {
        finish(() => resolve(message.value as T));
      }
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
