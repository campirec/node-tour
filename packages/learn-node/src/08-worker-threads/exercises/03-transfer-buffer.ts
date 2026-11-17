import { MessageChannel } from 'node:worker_threads';

/**
 * 练习 3：使用 transferList 零拷贝转移 ArrayBuffer。
 *
 * 场景：主线程读取大文件/图片后交给 Worker 处理，避免复制几百 MB 内存。
 *
 * 要求：
 * - 使用 MessageChannel 创建一对端口；
 * - port1.postMessage(buffer, [buffer]) 转移所有权；
 * - 返回接收到的 ArrayBuffer、原始 byteLength（转移后应为 0）与接收 byteLength；
 * - 完成或出错后关闭两个端口。
 */
export interface TransferResult {
  received: ArrayBuffer;
  originalByteLength: number;
  receivedByteLength: number;
}

export function transferBuffer(buffer: ArrayBuffer): Promise<TransferResult> {
  // TODO: new MessageChannel + port1.postMessage(buffer, [buffer])
  throw new Error('TODO: transferBuffer');
}
