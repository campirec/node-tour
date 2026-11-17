import { describe, expect, it } from 'vitest';
import { loadImpl } from '../../shared/load-impl.js';

const impl = await loadImpl({
  exercise: () => import('./04-parse-size-duration.js'),
  solution: () => import('./solutions/04-parse-size-duration.js'),
});

describe('parseByteSize', () => {
  it('解析常见容量单位', () => {
    expect(impl.parseByteSize('512')).toBe(512);
    expect(impl.parseByteSize('1KB')).toBe(1024);
    expect(impl.parseByteSize('1.5 KB')).toBe(1536);
    expect(impl.parseByteSize('10mb')).toBe(10 * 1024 * 1024);
    expect(impl.parseByteSize('2GB')).toBe(2 * 1024 ** 3);
    expect(impl.parseByteSize('0B')).toBe(0);
  });

  it('拒绝非法容量', () => {
    for (const value of ['', '10XB', '-1MB', 'abc', '1.2.3MB']) {
      expect(() => impl.parseByteSize(value)).toThrowError(RangeError);
    }
    expect(() => impl.parseByteSize('999999TB')).toThrowError(RangeError);
  });
});

describe('parseDuration', () => {
  it('解析常见时长单位', () => {
    expect(impl.parseDuration('250')).toBe(250);
    expect(impl.parseDuration('30ms')).toBe(30);
    expect(impl.parseDuration('2s')).toBe(2000);
    expect(impl.parseDuration('1.5m')).toBe(90_000);
    expect(impl.parseDuration('2h')).toBe(7_200_000);
    expect(impl.parseDuration('1d')).toBe(86_400_000);
  });

  it('拒绝非法时长', () => {
    for (const value of ['', '10x', '-5s', 's', '1.2.3s']) {
      expect(() => impl.parseDuration(value)).toThrowError(RangeError);
    }
    expect(() => impl.parseDuration('999999999d')).toThrowError(RangeError);
  });
});
