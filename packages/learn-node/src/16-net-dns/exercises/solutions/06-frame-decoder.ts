import { EventEmitter } from 'node:events';

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
    this.buffer = Buffer.concat([this.buffer, chunk]);

    for (;;) {
      if (this.buffer.length < 4) {
        return;
      }

      const length = this.buffer.readUInt32BE(0);
      if (length > this.maxFrameSize) {
        this.emit('error', new Error(`帧长 ${length} 超过上限 ${this.maxFrameSize}`));
        this.buffer = Buffer.alloc(0);
        return;
      }

      if (this.buffer.length < 4 + length) {
        return;
      }

      const frame = this.buffer.subarray(4, 4 + length);
      this.buffer = this.buffer.subarray(4 + length);
      this.emit('frame', frame);
    }
  }

  reset(): void {
    this.buffer = Buffer.alloc(0);
  }
}
