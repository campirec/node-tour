import { MessageChannel } from 'node:worker_threads';

/**
 * 练习 3：使用 transferList 零拷贝转移 ArrayBuffer
 *
 * 场景：主线程读取大文件/图片后交给 Worker 处理，通过 transferList 转移
 * ArrayBuffer 所有权，避免复制几百 MB 内存。转移后原 buffer 被分离（detached），
 * byteLength 变为 0。
 *
 * 函数签名
 *   transferBuffer(buffer: ArrayBuffer): Promise<TransferResult>
 *   - buffer：待转移的 ArrayBuffer
 *   - 返回：{ received, originalByteLength, receivedByteLength }
 *
 * 示例
 *   transferBuffer(new Uint8Array([1, 2, 3, 4, 5]).buffer)
 *   => { received: <含 [1,2,3,4,5] 的 ArrayBuffer>, originalByteLength: 0, receivedByteLength: 5 }
 *
 * 要求
 *   1. 使用 MessageChannel 创建一对端口（port1 / port2）；
 *   2. port1.postMessage(buffer, [buffer]) 转移所有权，port2 接收；
 *   3. 返回接收到的 ArrayBuffer 及其 byteLength，originalByteLength 为转移后
 *      原 buffer 的 byteLength（应为 0），receivedByteLength 为接收到的 byteLength；
 *   4. 完成或出错后关闭两个端口，清理定时器。
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
