import { Worker } from 'node:worker_threads';

interface WorkerReply<T> {
  ok: boolean;
  value?: T;
  error?: string;
}

export async function parseJsonInWorker<T = unknown>(
  text: string,
  timeoutMs = 5000,
): Promise<T> {
  if (typeof text !== 'string') {
    throw new TypeError('text 必须是字符串');
  }
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) {
    throw new RangeError('timeoutMs 必须是正数');
  }

  const workerUrl = new URL(
    '../../fixtures/json-parse-worker.mjs',
    import.meta.url,
  );

  return new Promise<T>((resolve, reject) => {
    const worker = new Worker(workerUrl, { workerData: { text } });
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
        reject(new Error(`Worker 解析超时（${timeoutMs}ms）`)),
      );
    }, timeoutMs);
    timer.unref();

    worker.once('message', (reply: WorkerReply<T>) => {
      finish(() => {
        if (reply.ok) {
          resolve(reply.value as T);
        } else {
          reject(new Error(reply.error ?? 'Worker 解析失败'));
        }
      });
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
