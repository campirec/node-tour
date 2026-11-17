import { randomBytes } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { loadImpl } from '../../shared/load-impl.js';

const impl = await loadImpl({
  exercise: () => import('./02-aes-gcm.js'),
  solution: () => import('./solutions/02-aes-gcm.js'),
});

const key = Buffer.alloc(32, 7);

describe('AES-256-GCM', () => {
  it('中文与空字符串往返', () => {
    for (const text of ['', '你好，Node.js', 'a'.repeat(1000)]) {
      expect(impl.decryptText(impl.encryptText(text, key), key)).toBe(text);
    }
  });

  it('相同明文每次密文不同（随机 IV）', () => {
    const first = impl.encryptText('same', key);
    const second = impl.encryptText('same', key);

    expect(first).not.toBe(second);
    expect(first.split('.')).toHaveLength(3);
  });

  it('篡改密文或认证标签会失败', () => {
    const payload = impl.encryptText('secret', key);
    const [iv, tag, data] = payload.split('.') as [string, string, string];

    // 改第一个字符，确保变化落在有效数据位，而不是 base64url 末尾的填充位。
    const flip = (value: string): string =>
      `${value.startsWith('A') ? 'B' : 'A'}${value.slice(1)}`;

    expect(() =>
      impl.decryptText(`${iv}.${tag}.${flip(data)}`, key),
    ).toThrowError();
    expect(() =>
      impl.decryptText(`${iv}.${flip(tag)}.${data}`, key),
    ).toThrowError();
  });

  it('错误密钥与错误密钥长度被拒绝', () => {
    const payload = impl.encryptText('secret', key);

    expect(() =>
      impl.decryptText(payload, Buffer.alloc(32, 8)),
    ).toThrowError();
    expect(() => impl.encryptText('x', Buffer.alloc(16))).toThrowError(
      '32 字节',
    );
    expect(() => impl.decryptText(payload, Buffer.alloc(16))).toThrowError(
      '32 字节',
    );
  });

  it('格式错误立即拒绝', () => {
    expect(() => impl.decryptText('not-a-valid-payload', key)).toThrowError(
      '密文格式错误',
    );
  });

  it('随机密钥也能正常往返', () => {
    const randomKey = randomBytes(32);
    expect(impl.decryptText(impl.encryptText('random', randomKey), randomKey)).toBe(
      'random',
    );
  });
});
