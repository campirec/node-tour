import { describe, expect, it } from 'vitest';
import { loadImpl } from '../../../shared/load-impl.js';

const impl = await loadImpl({
  exercise: () => import('../01-system-summary.js'),
  solution: () => import('../solutions/01-system-summary.js'),
});

describe('getSystemSummary', () => {
  it('返回合理的系统信息', () => {
    const summary = impl.getSystemSummary();

    expect(typeof summary.platform).toBe('string');
    expect(summary.platform.length).toBeGreaterThan(0);
    expect(summary.arch.length).toBeGreaterThan(0);
    expect(summary.cpuCount).toBeGreaterThanOrEqual(1);
    expect(summary.totalMemoryGb).toBeGreaterThan(0);
    expect(summary.freeMemoryGb).toBeGreaterThanOrEqual(0);
    expect(summary.freeMemoryGb).toBeLessThanOrEqual(summary.totalMemoryGb);
    expect(summary.hostname.length).toBeGreaterThan(0);
    expect(summary.uptimeSeconds).toBeGreaterThanOrEqual(0);
    expect(Number.isInteger(summary.uptimeSeconds)).toBe(true);
    expect(Number.isInteger(summary.totalMemoryGb * 10)).toBe(true);
  });
});
