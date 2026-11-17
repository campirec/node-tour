import { MessageChannel } from 'node:worker_threads';

export interface TransferResult {
  received: ArrayBuffer;
  originalByteLength: number;
  receivedByteLength: number;
}

export function transferBuffer(buffer: ArrayBuffer): Promise<TransferResult> {
  return new Promise<TransferResult>((resolve, reject) => {
    const { port1, port2 } = new MessageChannel();
    const timer = setTimeout(() => {
      port1.close();
      port2.close();
      reject(new Error('ArrayBuffer 转移超时'));
    }, 1000);
    timer.unref();

    const cleanup = (): void => {
      clearTimeout(timer);
      port1.close();
      port2.close();
    };

    port2.once('message', (received: ArrayBuffer) => {
      cleanup();
      resolve({
        received,
        originalByteLength: buffer.byteLength,
        receivedByteLength: received.byteLength,
      });
    });
    port2.once('messageerror', (error) => {
      cleanup();
      reject(error);
    });

    port1.postMessage(buffer, [buffer]);
  });
}
