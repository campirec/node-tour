import { isIP } from 'node:net';
import { describe, expect, it } from 'vitest';
import { loadImpl } from '../../shared/load-impl.js';

const impl = await loadImpl({
  exercise: () => import('./03-lookup-host.js'),
  solution: () => import('./solutions/03-lookup-host.js'),
});

describe('lookupHost', () => {
  it('解析 localhost（不依赖外网）', async () => {
    const result = await impl.lookupHost('localhost');

    expect([4, 6]).toContain(result.family);
    expect(isIP(result.address)).toBe(result.family);
  });

  it('空主机名被拒绝', async () => {
    await expect(impl.lookupHost('')).rejects.toThrowError('host 不能为空');
  });
});
