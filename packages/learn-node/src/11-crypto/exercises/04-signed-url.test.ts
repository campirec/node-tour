import { describe, expect, it } from 'vitest';
import { loadImpl } from '../../shared/load-impl.js';

const impl = await loadImpl({
  exercise: () => import('./04-signed-url.js'),
  solution: () => import('./solutions/04-signed-url.js'),
});

const SECRET = 'unit-test-signing-secret';

function clock(start = 1_000_000): {
  now: () => number;
  advance: (seconds: number) => void;
} {
  let current = start;
  return {
    now: () => current,
    advance: (seconds) => {
      current += seconds;
    },
  };
}

describe('signed URL', () => {
  it('生成可在有效期内验证的 URL', () => {
    const time = clock();
    const signed = impl.createSignedUrl(
      'https://files.test/reports/2026.pdf?download=1',
      SECRET,
      { expiresInSeconds: 60, now: time.now },
    );
    const parsed = new URL(signed);

    expect(parsed.searchParams.get('download')).toBe('1');
    expect(Number(parsed.searchParams.get('expires'))).toBe(1_000_060);
    expect(parsed.searchParams.get('signature')).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(impl.verifySignedUrl(signed, SECRET, { now: time.now })).toEqual({
      valid: true,
    });
  });

  it('过期后返回 expired', () => {
    const time = clock();
    const signed = impl.createSignedUrl('https://files.test/a', SECRET, {
      expiresInSeconds: 10,
      now: time.now,
    });
    time.advance(10);

    expect(impl.verifySignedUrl(signed, SECRET, { now: time.now })).toEqual({
      valid: false,
      reason: 'expired',
    });
  });

  it('篡改路径、方法或签名都会失败', () => {
    const time = clock();
    const signed = impl.createSignedUrl('https://files.test/a', SECRET, {
      method: 'GET',
      now: time.now,
    });

    const changedPath = new URL(signed);
    changedPath.pathname = '/b';
    expect(
      impl.verifySignedUrl(changedPath.toString(), SECRET, { now: time.now }),
    ).toEqual({ valid: false, reason: 'signature' });

    expect(
      impl.verifySignedUrl(signed, SECRET, {
        method: 'POST',
        now: time.now,
      }),
    ).toEqual({ valid: false, reason: 'signature' });

    const changedSignature = new URL(signed);
    changedSignature.searchParams.set('signature', 'forged');
    expect(
      impl.verifySignedUrl(changedSignature.toString(), SECRET, {
        now: time.now,
      }),
    ).toEqual({ valid: false, reason: 'signature' });
  });

  it('缺少参数或参数非法返回 missing/invalid', () => {
    expect(
      impl.verifySignedUrl('https://files.test/a', SECRET),
    ).toEqual({ valid: false, reason: 'missing' });

    const invalid = new URL('https://files.test/a');
    invalid.searchParams.set('expires', 'not-a-number');
    invalid.searchParams.set('signature', 'x');
    expect(impl.verifySignedUrl(invalid.toString(), SECRET)).toEqual({
      valid: false,
      reason: 'invalid',
    });
  });

  it('拒绝空 secret 与非法 URL', () => {
    expect(() => impl.createSignedUrl('https://files.test/a', '')).toThrowError(
      'secret 不能为空',
    );
    expect(() => impl.verifySignedUrl('https://files.test/a', '')).toThrowError(
      'secret 不能为空',
    );
    expect(() => impl.createSignedUrl('/relative', SECRET)).toThrowError(
      TypeError,
    );
  });
});
