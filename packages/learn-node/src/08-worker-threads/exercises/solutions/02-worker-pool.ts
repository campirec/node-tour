import { Worker } from 'node:worker_threads';

export interface PoolResult<T> {
  result: T;
  threadId: number;
}

interface WorkerMessage<T> {
  id: number;
  result: T;
  threadId: number;
}

export async function runInPool<T = number>(
  workerUrl: URL | string,
  values: readonly unknown[],
  size = 2,
): Promise<Array<PoolResult<T>>> {
  if (!Number.isInteger(size) || size < 1) {
    throw new RangeError('size 必须是正整数');
  }
  if (values.length === 0) {
    return [];
  }

  const workerCount = Math.min(size, values.length);
  const workers = Array.from(
    { length: workerCount },
    () => new Worker(workerUrl),
  );
  const results = new Array<PoolResult<T>>(values.length);

  return new Promise<Array<PoolResult<T>>>((resolve, reject) => {
    let nextTask = 0;
    let completed = 0;
    let settled = false;

    const terminateAll = async (): Promise<void> => {
      await Promise.all(workers.map((worker) => worker.terminate()));
    };

    const fail = (error: unknown): void => {
      if (settled) {
        return;
      }
      settled = true;
      void terminateAll().then(() => {
        reject(error instanceof Error ? error : new Error(String(error)));
      });
    };

    const succeed = (): void => {
      if (settled) {
        return;
      }
      settled = true;
      void terminateAll().then(() => resolve(results));
    };

    const assignNext = (worker: Worker): void => {
      if (settled || nextTask >= values.length) {
        return;
      }
      const id = nextTask;
      nextTask += 1;
      worker.postMessage({ id, value: values[id] });
    };

    for (const worker of workers) {
      worker.on('message', (message: WorkerMessage<T>) => {
        if (settled) {
          return;
        }
        results[message.id] = {
          result: message.result,
          threadId: message.threadId,
        };
        completed += 1;

        if (completed === values.length) {
          succeed();
        } else {
          assignNext(worker);
        }
      });
      worker.on('error', fail);
      worker.on('exit', (code) => {
        if (code !== 0) {
          fail(new Error(`Worker 退出码 ${code}`));
        }
      });
      assignNext(worker);
    }
  });
}
