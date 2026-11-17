import { parentPort, threadId } from 'node:worker_threads';

parentPort.on('message', ({ id, value }) => {
  parentPort.postMessage({
    id,
    result: value * value,
    threadId,
  });
});
