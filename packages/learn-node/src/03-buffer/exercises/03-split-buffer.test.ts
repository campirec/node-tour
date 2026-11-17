import { describe, expect, it } from 'vitest';
import { loadImpl } from '../../shared/load-impl.js';

const impl = await loadImpl({
  exercise: () => import('./03-split-buffer.js'),
  solution: () => import('./solutions/03-split-buffer.js'),
});

describe('splitBuffer', () => {
  it('按 ASCII 分隔符切分并保留空片段', () => {
    const parts = impl.splitBuffer(
      Buffer.from('alpha,beta,,gamma'),
      Buffer.from(','),
    );

    expect(parts.map((part) => part.toString('utf8'))).toEqual([
      'alpha',
      'beta',
      '',
      'gamma',
    ]);
  });

  it('支持多字节 UTF-8 分隔符', () => {
    const parts = impl.splitBuffer(
      Buffer.from('第一段|分隔|第二段|分隔|'),
      Buffer.from('|分隔|'),
    );

    expect(parts.map((part) => part.toString('utf8'))).toEqual([
      '第一段',
      '第二段',
      '',
    ]);
  });

  it('无匹配时返回原内容的单一片段', () => {
    const data = Buffer.from([0, 1, 2, 3]);
    const parts = impl.splitBuffer(data, Buffer.from([9, 9]));

    expect(parts).toHaveLength(1);
    expect(parts[0]).toEqual(data);
  });

  it('空输入与空分隔符的边界', () => {
    expect(impl.splitBuffer(Buffer.alloc(0), Buffer.from(','))).toEqual([
      Buffer.alloc(0),
    ]);
    expect(() => impl.splitBuffer(Buffer.from('a'), Buffer.alloc(0))).toThrowError(
      '分隔符不能为空',
    );
  });
});
