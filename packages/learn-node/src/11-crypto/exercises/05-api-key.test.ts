import { describe, expect, it } from 'vitest';
import { loadImpl } from '../../shared/load-impl.js';

const impl = await loadImpl({
  exercise: () => import('./05-api-key.js'),
  solution: () => import('./solutions/05-api-key.js'),
});

describe('API Key', () => {
  it('生成带前缀的高熵 token 与 hash', () => {
    const key = impl.generateApiKey('sk_test');

    expect(key.token).toMatch(/^sk_test_[A-Za-z0-9_-]{43}$/);
    expect(key.token.startsWith('sk_test_')).toBe(true);
    expect(key.hash).toMatch(/^[0-9a-f]{64}$/);
    expect(key.prefix).toBe(key.token.slice(0, 12));
    expect(impl.verifyApiKey(key.token, key.hash)).toBe(true);
  });

  it('每次生成不同的 token，旧 token 不会被新 hash 验证通过', () => {
    const first = impl.generateApiKey();
    const second = impl.generateApiKey();

    expect(first.token).not.toBe(second.token);
    expect(first.hash).not.toBe(second.hash);
    expect(impl.verifyApiKey(first.token, second.hash)).toBe(false);
  });

  it('错误 token、空 token 与非法 hash 返回 false', () => {
    const key = impl.generateApiKey();

    expect(impl.verifyApiKey(`${key.token}x`, key.hash)).toBe(false);
    expect(impl.verifyApiKey('', key.hash)).toBe(false);
    expect(impl.verifyApiKey(key.token, 'not-a-hash')).toBe(false);
    expect(impl.verifyApiKey(key.token, 'a'.repeat(64))).toBe(false);
  });

  it('hashApiKey 稳定且拒绝空 token', () => {
    const token = 'sk_live_example';
    expect(impl.hashApiKey(token)).toBe(impl.hashApiKey(token));
    expect(() => impl.hashApiKey('')).toThrowError('token 不能为空');
  });

  it('拒绝非法 prefix', () => {
    expect(() => impl.generateApiKey('bad prefix')).toThrowError(RangeError);
    expect(() => impl.generateApiKey('x')).toThrowError(RangeError);
  });
});
