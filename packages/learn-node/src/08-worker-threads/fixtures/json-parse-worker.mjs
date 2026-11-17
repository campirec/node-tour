import { parentPort, workerData } from 'node:worker_threads';

try {
  const value = JSON.parse(workerData.text);
  parentPort.postMessage({ ok: true, value });
} catch (error) {
  parentPort.postMessage({
    ok: false,
    error: error instanceof Error ? error.message : String(error),
  });
}
