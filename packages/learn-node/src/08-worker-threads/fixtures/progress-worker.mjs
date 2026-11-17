import { parentPort, workerData } from 'node:worker_threads';

const total = workerData.steps ?? 3;
for (let done = 1; done <= total; done += 1) {
  parentPort.postMessage({ type: 'progress', done, total });
  await new Promise((resolve) => setTimeout(resolve, 5));
}

parentPort.postMessage({ type: 'result', value: workerData.value * 2 });
