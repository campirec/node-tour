import { describe, expect, it } from 'vitest';
import { loadImpl } from '../../../shared/load-impl.js';

const impl = await loadImpl({
  exercise: () => import('../03-hmac-signature.js'),
  solution: () => import('../solutions/03-hmac-signature.js'),
});

describe('HMAC 签名', () => {
  it('匹配已知测试向量', () => {
    expect(
      impl.signPayload(
        'The quick brown fox jumps over the lazy dog',
        'key',
      ),
    ).toBe(
      'f7bc83f430538424b13298e6aa6fb143ef4d59a14946175997479dbc2d1a3cd8',
    );
  });

  it('签名确定性且可以验证', () => {
    const signature = impl.signPayload('{"id":1}', 'topsecret');

    expect(signature).toMatch(/^[0-9a-f]{64}$/);
    expect(impl.signPayload('{"id":1}', 'topsecret')).toBe(signature);
    expect(impl.verifySignature('{"id":1}', signature, 'topsecret')).toBe(true);
  });

  it('payload、签名或 secret 被篡改都失败', () => {
    const signature = impl.signPayload('{"amount":100}', 'secret');

    expect(impl.verifySignature('{"amount":999}', signature, 'secret')).toBe(
      false,
    );
    expect(
      impl.verifySignature('{"amount":100}', `${signature.slice(0, -1)}0`, 'secret'),
    ).toBe(false);
    expect(
      impl.verifySignature('{"amount":100}', signature, 'other-secret'),
    ).toBe(false);
  });

  it('长度不匹配不会抛错，直接返回 false', () => {
    expect(impl.verifySignature('payload', 'abc', 'secret')).toBe(false);
    expect(impl.verifySignature('payload', '', 'secret')).toBe(false);
  });

  it('空 secret 拒绝签名', () => {
    expect(() => impl.signPayload('payload', '')).toThrowError(
      'secret 不能为空',
    );
  });
});
