import { parentPort, threadId, workerData } from 'node:worker_threads';

parentPort.postMessage({ workerData, threadId });
