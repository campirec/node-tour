import { describe, expect, it } from 'vitest';
import { loadImpl } from '../../../shared/load-impl.js';

const impl = await loadImpl({
  exercise: () => import('../02-stringify-for-log.js'),
  solution: () => import('../solutions/02-stringify-for-log.js'),
});

describe('stringifyForLog', () => {
  it('输出嵌套对象、Map 与 Set', () => {
    const value = {
      user: { id: 1, roles: new Set(['admin', 'ops']) },
      counters: new Map([['errors', 2]]),
      big: 10n,
    };

    const text = impl.stringifyForLog(value);

    expect(text).toContain('user');
    expect(text).toContain('admin');
    expect(text).toContain('errors');
    expect(text).toContain('10n');
  });

  it('循环引用不会抛错', () => {
    const value: Record<string, unknown> = { name: 'loop' };
    value.self = value;

    const text = impl.stringifyForLog(value);

    expect(text).toContain('ref *1');
  });

  it('超长输出被截断并标注', () => {
    const text = impl.stringifyForLog({ data: 'x'.repeat(1000) }, 50);

    expect(text).toContain('truncated');
    expect(text.length).toBeGreaterThan(50);
  });

  it('非法 maxLength 抛出 RangeError', () => {
    expect(() => impl.stringifyForLog({}, 0)).toThrowError(RangeError);
    expect(() => impl.stringifyForLog({}, 1.5)).toThrowError(RangeError);
  });
});
