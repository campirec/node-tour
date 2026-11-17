import { describe, expect, it } from 'vitest';
import { loadImpl } from '../../shared/load-impl.js';

const impl = await loadImpl({
  exercise: () => import('./01-length-prefixed-codec.js'),
  solution: () => import('./solutions/01-length-prefixed-codec.js'),
});

describe('长度前缀编解码', () => {
  it('头部写入 UTF-8 字节数', () => {
    const buffer = impl.encodeMessage('你好');

    expect(buffer.readUInt32BE(0)).toBe(6);
    expect(buffer.byteLength).toBe(10);
  });

  it('中文与空字符串都能往返', () => {
    for (const text of ['hello', '你好，Node.js', '']) {
      expect(impl.decodeMessage(impl.encodeMessage(text))).toBe(text);
    }
  });

  it('拒绝不完整的头或消息体', () => {
    expect(() => impl.decodeMessage(Buffer.from([0, 0, 0]))).toThrowError(
      '消息头不完整',
    );

    const encoded = impl.encodeMessage('abcdef');
    expect(() => impl.decodeMessage(encoded.subarray(0, 8))).toThrowError(
      '消息体不完整',
    );
  });

  it('拒绝尾部多余字节', () => {
    const encoded = impl.encodeMessage('ok');

    expect(() =>
      impl.decodeMessage(Buffer.concat([encoded, Buffer.from([1])])),
    ).toThrowError('消息包含多余字节');
  });
});
