import { describe, expect, it } from 'vitest';
import { loadEnv, parseCorsOrigins } from './env.js';

describe('loadEnv', () => {
  it('为空环境提供可用默认值', () => {
    const env = loadEnv({});

    expect(env).toMatchObject({
      NODE_ENV: 'development',
      PORT: 3000,
      HOST: '0.0.0.0',
      LOG_LEVEL: 'info',
      CORS_ORIGINS: 'http://localhost:5173',
    });
  });

  it('把字符串端口转换为数字', () => {
    expect(loadEnv({ PORT: '8080' }).PORT).toBe(8080);
  });

  it('遇到非法配置立即抛出可读错误', () => {
    expect(() => loadEnv({ PORT: 'not-a-port' })).toThrowError(
      /PORT: Invalid input/,
    );
    expect(() => loadEnv({ NODE_ENV: 'staging' })).toThrowError(/NODE_ENV/);
  });
});

describe('parseCorsOrigins', () => {
  it('去空格并过滤空项', () => {
    expect(
      parseCorsOrigins('http://a.test, http://b.test, ,'),
    ).toEqual(['http://a.test', 'http://b.test']);
  });
});
