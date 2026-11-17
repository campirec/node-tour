import { EventEmitter } from 'node:events';

/**
 * 企业级练习：TCP 分帧解码器。
 *
 * 场景：自定义 RPC 协议、消息队列客户端、IoT 网关。
 * TCP 是字节流，一次 data 事件可能包含半帧、一帧或多帧。
 *
 * 要求：
 * - 使用长度前缀协议：4 字节大端长度 + payload；
 * - 实现 FrameDecoder 类，继承 EventEmitter；
 * - push(chunk) 接收 Buffer，内部累积并解析完整帧；
 * - 每解析出一帧 emit('frame', payload: Buffer)；
 * - 帧长超过 maxFrameSize 时 emit('error') 并停止解析；
 * - 支持跨 chunk 拆帧与多帧合并；
 * - reset() 清空内部缓冲。
 */
export class FrameDecoder extends EventEmitter {
  buffer: Buffer = Buffer.alloc(0);
  readonly maxFrameSize: number;

  constructor(maxFrameSize = 1024 * 1024) {
    super();
    if (!Number.isInteger(maxFrameSize) || maxFrameSize < 1) {
      throw new RangeError('maxFrameSize 必须是正整数');
    }
    this.maxFrameSize = maxFrameSize;
  }

  push(chunk: Buffer): void {
    // TODO: 累积 buffer -> 循环解析长度前缀 -> emit('frame')
    throw new Error('TODO: push');
  }

  reset(): void {
    // TODO
    throw new Error('TODO: reset');
  }
}
