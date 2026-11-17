import { describe, expect, it } from 'vitest';
import { loadImpl } from '../../../shared/load-impl.js';

const impl = await loadImpl({
  exercise: () => import('../03-parse-dotenv.js'),
  solution: () => import('../solutions/03-parse-dotenv.js'),
});

describe('parseDotenv', () => {
  it('解析注释、引号、单引号与空值', () => {
    const env = impl.parseDotenv(
      [
        'FOO=bar',
        '# comment',
        'QUOTED="hello world"',
        "SINGLE='a b'",
        'EMPTY=',
      ].join('\n'),
    );

    expect(env).toMatchObject({
      FOO: 'bar',
      QUOTED: 'hello world',
      SINGLE: 'a b',
      EMPTY: '',
    });
  });

  it('空文本返回空对象', () => {
    expect(Object.keys(impl.parseDotenv(''))).toHaveLength(0);
  });

  it('非字符串输入抛 TypeError', () => {
    expect(() => impl.parseDotenv(null as unknown as string)).toThrowError(
      TypeError,
    );
  });
});
