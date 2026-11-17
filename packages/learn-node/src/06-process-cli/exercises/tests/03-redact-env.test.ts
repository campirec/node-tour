import { describe, expect, it } from 'vitest';
import { loadImpl } from '../../../shared/load-impl.js';

const impl = await loadImpl({
  exercise: () => import('../03-redact-env.js'),
  solution: () => import('../solutions/03-redact-env.js'),
});

describe('redactEnv', () => {
  it('按 key 语义脱敏，只替换敏感值', () => {
    const env = {
      PATH: '/usr/bin',
      NODE_ENV: 'production',
      MONKEY: 'banana',
      OPENAI_API_KEY: ['secret', 'value'].join('-'),
      DB_PASSWORD: 'p@ss',
      AUTH_TOKEN: 'token',
      MAX_RETRIES: '3',
      MISSING: undefined,
    };

    const result = impl.redactEnv(env);

    expect(result).toEqual({
      PATH: '/usr/bin',
      NODE_ENV: 'production',
      MONKEY: 'banana',
      OPENAI_API_KEY: '[redacted]',
      DB_PASSWORD: '[redacted]',
      AUTH_TOKEN: '[redacted]',
      MAX_RETRIES: '3',
    });
  });

  it('不修改原对象，undefined 值不会变成字符串', () => {
    const env = { SECRET_VALUE: 'x', EMPTY: undefined };
    impl.redactEnv(env);

    expect(env.SECRET_VALUE).toBe('x');
    expect('EMPTY' in impl.redactEnv(env)).toBe(false);
  });
});
