import { describe, expect, it } from 'vitest';
import { loadImpl } from '../../../shared/load-impl.js';

const impl = await loadImpl({
  exercise: () => import('../05-process-health.js'),
  solution: () => import('../solutions/05-process-health.js'),
});

const MB = 1024 * 1024;

function fakeProcess(): {
  pid: number;
  version: string;
  platform: NodeJS.Platform;
  uptime(): number;
  memoryUsage(): NodeJS.MemoryUsage;
} {
  return {
    pid: 4321,
    version: 'v22.12.0',
    platform: 'linux',
    uptime: () => 3600.4,
    memoryUsage: () => ({
      rss: 200.04 * MB,
      heapTotal: 120 * MB,
      heapUsed: 80.06 * MB,
      external: 10 * MB,
      arrayBuffers: 2 * MB,
    }),
  };
}

describe('getProcessHealth', () => {
  it('从注入的进程对象生成 MB 指标', () => {
    expect(impl.getProcessHealth(fakeProcess())).toEqual({
      pid: 4321,
      uptimeSeconds: 3600,
      rssMb: 200,
      heapUsedMb: 80.1,
      heapTotalMb: 120,
      externalMb: 10,
      nodeVersion: 'v22.12.0',
      platform: 'linux',
    });
  });

  it('默认读取真实 process 且数值合理', () => {
    const health = impl.getProcessHealth();

    expect(health.pid).toBe(process.pid);
    expect(health.uptimeSeconds).toBeGreaterThanOrEqual(0);
    expect(health.rssMb).toBeGreaterThan(0);
    expect(health.nodeVersion).toBe(process.version);
  });
});

describe('isOverBudget', () => {
  const health = impl.getProcessHealth(fakeProcess());

  it('未超预算', () => {
    expect(
      impl.isOverBudget(health, {
        maxRssMb: 300,
        maxHeapUsedMb: 100,
        maxUptimeSeconds: 7200,
      }),
    ).toEqual({ over: false, reasons: [] });
  });

  it('返回所有超限原因', () => {
    expect(
      impl.isOverBudget(health, {
        maxRssMb: 100,
        maxHeapUsedMb: 50,
        maxUptimeSeconds: 60,
      }),
    ).toEqual({
      over: true,
      reasons: ['rss', 'heapUsed', 'uptime'],
    });
  });

  it('拒绝非法预算', () => {
    expect(() =>
      impl.isOverBudget(health, {
        maxRssMb: -1,
        maxHeapUsedMb: 100,
        maxUptimeSeconds: 100,
      }),
    ).toThrowError(RangeError);
  });
});
