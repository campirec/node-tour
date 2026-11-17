import { describe, expect, it } from 'vitest';
import { loadImpl } from '../../../shared/load-impl.js';

const impl = await loadImpl({
  exercise: () => import('../04-jwt-decode.js'),
  solution: () => import('../solutions/04-jwt-decode.js'),
});

function encodePart(value: unknown): string {
  return Buffer.from(JSON.stringify(value), 'utf8').toString('base64url');
}

function token(header: unknown, payload: unknown, signature = 'sig'): string {
  return `${encodePart(header)}.${encodePart(payload)}.${signature}`;
}

describe('decodeJwt', () => {
  it('解析 header、payload 与 signature', () => {
    const jwt = token(
      { alg: 'HS256', typ: 'JWT' },
      { sub: 'user-1', role: 'admin' },
    );

    const decoded = impl.decodeJwt(jwt);

    expect(decoded.header).toEqual({ alg: 'HS256', typ: 'JWT' });
    expect(decoded.payload).toEqual({ sub: 'user-1', role: 'admin' });
    expect(decoded.signature).toBe('sig');
  });

  it('支持中文 claims', () => {
    const decoded = impl.decodeJwt(
      token({ alg: 'none' }, { name: '张三', department: '平台部' }),
    );

    expect(decoded.payload.name).toBe('张三');
  });

  it('拒绝段数错误、空签名与非法 base64url', () => {
    expect(() => impl.decodeJwt('a.b')).toThrowError('3 段');
    expect(() => impl.decodeJwt(`${encodePart({})}.${encodePart({})}.`)).toThrowError(
      '签名',
    );
    expect(() => impl.decodeJwt('a+b.c.d')).toThrowError('header');
  });

  it('拒绝非 JSON、数组与 null payload', () => {
    const header = encodePart({ alg: 'HS256' });
    const invalidJson = Buffer.from('not-json', 'utf8').toString('base64url');

    expect(() => impl.decodeJwt(`${header}.${invalidJson}.sig`)).toThrowError(
      'payload',
    );
    expect(() =>
      impl.decodeJwt(`${header}.${encodePart([1, 2])}.sig`),
    ).toThrowError('payload');
    expect(() =>
      impl.decodeJwt(`${header}.${encodePart(null)}.sig`),
    ).toThrowError('payload');
  });
});

describe('isTokenExpired', () => {
  it('比较 exp 与当前时间', () => {
    expect(impl.isTokenExpired({ exp: 100 }, 100)).toBe(true);
    expect(impl.isTokenExpired({ exp: 101 }, 100)).toBe(false);
    expect(impl.isTokenExpired({}, 100)).toBe(false);
    expect(impl.isTokenExpired({ exp: '100' }, 100)).toBe(false);
  });
});
