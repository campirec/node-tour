import { EventEmitter } from 'node:events';

/**
 * 企业级练习：TCP 分帧解码器
 *
 * 场景：自定义 RPC 协议、消息队列客户端、IoT 网关。TCP 是字节流，一次 data
 * 事件可能包含半帧、一帧或多帧，需要按长度前缀协议正确拆包。
 *
 * 协议格式：4 字节大端无符号整数表示 payload 长度，紧跟 payload 字节。
 *
 * 函数签名
 *   class FrameDecoder extends EventEmitter
 *   - constructor(maxFrameSize?: number)：最大允许的帧 payload 长度，默认 1MB
 *   - push(chunk: Buffer): void：写入数据，内部累积并解析完整帧
 *   - reset(): void：清空内部缓冲
 *   - 事件 'frame'：参数 payload: Buffer，每解析出一帧触发一次
 *   - 事件 'error'：参数 Error，帧长超过 maxFrameSize 时触发
 *
 * 示例
 *   const decoder = new FrameDecoder();
 *   decoder.on('frame', (f: Buffer) => console.log(f.toString()));
 *   decoder.push(Buffer.concat([header, Buffer.from('hello')]));
 *   // header = 4 字节大端写入 payload.length
 *   // => 输出 'hello'
 *
 *   const decoder2 = new FrameDecoder(4);
 *   decoder2.on('error', (err: Error) => console.log(err.message));
 *   decoder2.push(声明帧长为 100 的头部);
 *   // => 输出含 '帧长' 的错误信息
 *
 * 要求
 *   1. push(chunk) 将 chunk 追加到内部缓冲，循环解析：缓冲不足 4 字节时等待更多数据；
 *   2. 读取 4 字节大端长度前缀，缓冲中 payload 部分不足时等待更多数据；
 *   3. 完整帧解析后 emit('frame', payload)，payload 为 Buffer 的 subarray（共享内存）；
 *   4. 支持跨 chunk 拆帧（一帧被拆到多次 push）与多帧合并（一次 push 含多帧）；
 *   5. 帧长超过 maxFrameSize 时 emit('error', Error)，错误 message 含"帧长"，
 *      并清空缓冲停止解析；
 *   6. push(空 Buffer) 不触发任何 frame 事件；
 *   7. reset() 清空内部缓冲，丢弃未解析的半帧数据；
 *   8. maxFrameSize 必须是正整数，否则构造时抛 RangeError。
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
