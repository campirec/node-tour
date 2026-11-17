import { describe, expect, it } from 'vitest';
import { loadImpl } from '../../../shared/load-impl.js';

const impl = await loadImpl({
  exercise: () => import('../02-base64url.js'),
  solution: () => import('../solutions/02-base64url.js'),
});

describe('base64url', () => {
  it('编码结果不含 + / =', () => {
    const text = '随便一段会触发特殊字符的文本??>>';

    expect(impl.toBase64Url(text)).toMatch(/^[A-Za-z0-9_-]*$/);
    expect(impl.toBase64Url('hello')).toBe('aGVsbG8');
  });

  it('字符串与 Buffer 都能往返', () => {
    for (const value of ['', 'Node.js', '你好，世界', '?'.repeat(10)]) {
      expect(impl.fromBase64Url(impl.toBase64Url(value)).toString('utf8')).toBe(
        value,
      );
    }

    const bytes = Buffer.from([0, 1, 2, 253, 254, 255]);
    expect(impl.fromBase64Url(impl.toBase64Url(bytes))).toEqual(bytes);
  });

  it('拒绝标准 Base64 字符与填充', () => {
    expect(() => impl.fromBase64Url('a+b/')).toThrowError('非法 base64url');
    expect(() => impl.fromBase64Url('aGVsbG8=')).toThrowError(
      '非法 base64url',
    );
  });
});
