import { describe, expect, it } from 'vitest';
import { loadImpl } from '../../shared/load-impl.js';

const impl = await loadImpl({
  exercise: () => import('./01-password-hash.js'),
  solution: () => import('./solutions/01-password-hash.js'),
});

describe('密码哈希', () => {
  it('相同密码每次哈希不同，但都能验证通过', async () => {
    const first = await impl.hashPassword('correct horse battery staple');
    const second = await impl.hashPassword('correct horse battery staple');

    expect(first).not.toBe(second);
    expect(first).toMatch(/^scrypt\$[A-Za-z0-9_-]+\$[A-Za-z0-9_-]+$/);
    await expect(impl.verifyPassword('correct horse battery staple', first)).resolves.toBe(true);
    await expect(impl.verifyPassword('correct horse battery staple', second)).resolves.toBe(true);
  });

  it('错误密码验证失败', async () => {
    const stored = await impl.hashPassword('正确密码');

    await expect(impl.verifyPassword('错误密码', stored)).resolves.toBe(false);
  });

  it('格式非法或算法不匹配返回 false', async () => {
    await expect(impl.verifyPassword('x', '')).resolves.toBe(false);
    await expect(impl.verifyPassword('x', 'md5$abc$def')).resolves.toBe(false);
    await expect(impl.verifyPassword('x', 'scrypt$only-two-parts')).resolves.toBe(false);
  });

  it('空密码拒绝生成哈希', async () => {
    await expect(impl.hashPassword('')).rejects.toThrowError('密码不能为空');
  });
});
