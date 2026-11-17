import { describe, expect, it } from 'vitest';
import { loadImpl } from '../../shared/load-impl.js';

const impl = await loadImpl({
  exercise: () => import('./06-pbkdf2.js'),
  solution: () => import('./solutions/06-pbkdf2.js'),
});

describe('deriveKey / verifyDerivedKey', () => {
  it('使用随机盐派生密钥，每次结果不同', async () => {
    const first = await impl.deriveKey('my-password');
    const second = await impl.deriveKey('my-password');

    expect(first.derivedKey).not.toBe(second.derivedKey);
    expect(first.salt).not.toBe(second.salt);
    expect(first.iterations).toBe(100_000);
    expect(first.algorithm).toBe('sha256');
    expect(first.derivedKey).toMatch(/^[A-Za-z0-9_-]+$/);
  });

  it('相同盐与迭代次数派生相同密钥', async () => {
    const salt = Buffer.alloc(16, 7);
    const first = await impl.deriveKey('password', salt, 50_000);
    const second = await impl.deriveKey('password', salt, 50_000);

    expect(first.derivedKey).toBe(second.derivedKey);
  });

  it('正确密码验证通过，错误密码失败', async () => {
    const derived = await impl.deriveKey('correct-password');

    await expect(impl.verifyDerivedKey('correct-password', derived)).resolves.toBe(true);
    await expect(impl.verifyDerivedKey('wrong-password', derived)).resolves.toBe(false);
  });

  it('非法 iterations 被拒绝', async () => {
    await expect(impl.deriveKey('pw', undefined, 9999)).rejects.toBeInstanceOf(RangeError);
    await expect(impl.deriveKey('pw', undefined, 1_000_001)).rejects.toBeInstanceOf(RangeError);
  });

  it('空密码被拒绝', async () => {
    await expect(impl.deriveKey('')).rejects.toThrowError('密码不能为空');
  });
});
