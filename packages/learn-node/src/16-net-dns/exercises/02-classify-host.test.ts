import { describe, expect, it } from 'vitest';
import { loadImpl } from '../../shared/load-impl.js';

const impl = await loadImpl({
  exercise: () => import('./02-classify-host.js'),
  solution: () => import('./solutions/02-classify-host.js'),
});

describe('classifyHost', () => {
  it('识别 IPv4 与 IPv6', () => {
    expect(impl.classifyHost('127.0.0.1')).toBe('ipv4');
    expect(impl.classifyHost(' 192.168.1.1 ')).toBe('ipv4');
    expect(impl.classifyHost('::1')).toBe('ipv6');
    expect(impl.classifyHost('2001:db8::1')).toBe('ipv6');
  });

  it('非法 IP 与域名归类为 hostname', () => {
    expect(impl.classifyHost('example.com')).toBe('hostname');
    expect(impl.classifyHost('localhost')).toBe('hostname');
    expect(impl.classifyHost('999.1.1.1')).toBe('hostname');
    expect(impl.classifyHost('')).toBe('hostname');
  });
});
