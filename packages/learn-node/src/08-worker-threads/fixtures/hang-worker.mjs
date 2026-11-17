import { parentPort } from 'node:worker_threads';

parentPort.on('message', () => {
  // 故意不回复
});

setInterval(() => {}, 1000);
