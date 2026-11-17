import { describe, expect, it } from 'vitest';
import { loadImpl } from '../../shared/load-impl.js';

const impl = await loadImpl({
  exercise: () => import('./05-cursor-codec.js'),
  solution: () => import('./solutions/05-cursor-codec.js'),
});

describe('cursor codec', () => {
  it('往返 createdAt 与 id', () => {
    const cursor = {
      createdAt: '2026-01-02T03:04:05.000Z',
      id: '018f4a2c-7b1d-7c3a-9e2f-123456789abc',
    };

    const encoded = impl.encodeCursor(cursor);

    expect(encoded).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(impl.decodeCursor(encoded)).toEqual(cursor);
  });

  it('编码内容不直接暴露 JSON 结构', () => {
    const encoded = impl.encodeCursor({
      createdAt: '2026-01-02T03:04:05.000Z',
      id: 'a',
    });

    expect(encoded).not.toContain('createdAt');
    expect(
      JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')),
    ).toMatchObject({ v: 1, id: 'a' });
  });

  it('拒绝缺失字段与非法日期', () => {
    expect(() =>
      impl.encodeCursor({ createdAt: '2026-01-02T03:04:05.000Z', id: '' }),
    ).toThrowError(impl.CursorError);
    expect(() =>
      impl.encodeCursor({ createdAt: 'not-a-date', id: 'a' }),
    ).toThrowError(impl.CursorError);
  });

  it('拒绝篡改、版本不匹配与非法 JSON', () => {
    expect(() => impl.decodeCursor('bad+cursor')).toThrowError(
      impl.CursorError,
    );
    expect(() =>
      impl.decodeCursor(
        Buffer.from(JSON.stringify({ v: 2, createdAt: '2026-01-01', id: 'a' }))
          .toString('base64url'),
      ),
    ).toThrowError(impl.CursorError);
    expect(() =>
      impl.decodeCursor(Buffer.from('not-json').toString('base64url')),
    ).toThrowError(impl.CursorError);
  });

  it('拒绝缺失 id 或非法日期', () => {
    const encode = (value: unknown): string =>
      Buffer.from(JSON.stringify(value)).toString('base64url');

    expect(() =>
      impl.decodeCursor(
        encode({ v: 1, createdAt: '2026-01-01', id: '' }),
      ),
    ).toThrowError(impl.CursorError);
    expect(() =>
      impl.decodeCursor(
        encode({ v: 1, createdAt: 'nope', id: 'a' }),
      ),
    ).toThrowError(impl.CursorError);
  });
});
