import { describe, expect, it } from 'vitest';
import { loadImpl } from '../../../shared/load-impl.js';

const impl = await loadImpl({
  exercise: () => import('../06-frame-decoder.js'),
  solution: () => import('../solutions/06-frame-decoder.js'),
});

function encodeFrame(payload: Buffer): Buffer {
  const header = Buffer.alloc(4);
  header.writeUInt32BE(payload.length, 0);
  return Buffer.concat([header, payload]);
}

describe('FrameDecoder', () => {
  it('解析单帧', () => {
    const decoder = new impl.FrameDecoder();
    const frames: Buffer[] = [];
    decoder.on('frame', (frame: Buffer) => frames.push(frame));

    decoder.push(encodeFrame(Buffer.from('hello')));

    expect(frames).toEqual([Buffer.from('hello')]);
  });

  it('跨 chunk 拆帧', () => {
    const decoder = new impl.FrameDecoder();
    const frames: Buffer[] = [];
    decoder.on('frame', (frame: Buffer) => frames.push(frame));

    const frame = encodeFrame(Buffer.from('world'));
    decoder.push(frame.subarray(0, 2));
    decoder.push(frame.subarray(2));

    expect(frames).toEqual([Buffer.from('world')]);
  });

  it('多帧合并在一个 chunk', () => {
    const decoder = new impl.FrameDecoder();
    const frames: Buffer[] = [];
    decoder.on('frame', (frame: Buffer) => frames.push(frame));

    const chunk = Buffer.concat([
      encodeFrame(Buffer.from('a')),
      encodeFrame(Buffer.from('b')),
      encodeFrame(Buffer.from('c')),
    ]);
    decoder.push(chunk);

    expect(frames.map((f) => f.toString())).toEqual(['a', 'b', 'c']);
  });

  it('帧长超过 maxFrameSize 时 emit error', () => {
    const decoder = new impl.FrameDecoder(4);
    const errors: Error[] = [];
    decoder.on('error', (err: Error) => errors.push(err));

    const oversized = Buffer.alloc(8);
    oversized.writeUInt32BE(100, 0); // 声明 100 字节，超过 maxFrameSize 4
    decoder.push(oversized);

    expect(errors).toHaveLength(1);
    expect(errors[0]?.message).toContain('帧长');
  });

  it('reset 清空缓冲', () => {
    const decoder = new impl.FrameDecoder();
    const frames: Buffer[] = [];
    decoder.on('frame', (frame: Buffer) => frames.push(frame));

    decoder.push(encodeFrame(Buffer.from('x')).subarray(0, 2));
    decoder.reset();
    decoder.push(encodeFrame(Buffer.from('y')));

    expect(frames.map((f) => f.toString())).toEqual(['y']);
  });

  it('空 chunk 不触发 frame', () => {
    const decoder = new impl.FrameDecoder();
    let count = 0;
    decoder.on('frame', () => { count += 1; });

    decoder.push(Buffer.alloc(0));

    expect(count).toBe(0);
  });
});
