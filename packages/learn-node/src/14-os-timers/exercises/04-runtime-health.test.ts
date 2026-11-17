import { describe, expect, it } from 'vitest';
import { loadImpl } from '../../shared/load-impl.js';

const impl = await loadImpl({
  exercise: () => import('./04-runtime-health.js'),
  solution: () => import('./solutions/04-runtime-health.js'),
});

const MB = 1024 * 1024;

const fake: {
  pid: number;
  version: string;
  platform: NodeJS.Platform;
  uptime(): number;
  memoryUsage(): NodeJS.MemoryUsage;
} = {
  pid: 999,
  version: 'v22.12.0',
  platform: 'linux',
  uptime: () => 7200.6,
  memoryUsage: () => ({
    rss: 256.06 * MB,
    heapTotal: 180 * MB,
    heapUsed: 100.04 * MB,
    external: 12 * MB,
    arrayBuffers: 4 * MB,
  }),
};

describe('getRuntimeHealth', () => {
  it('把字节转换为 MB 并取整 uptime', () => {
    expect(impl.getRuntimeHealth(fake)).toEqual({
      pid: 999,
      uptimeSeconds: 7201,
      rssMb: 256.1,
      heapUsedMb: 100,
      heapTotalMb: 180,
      externalMb: 12,
      nodeVersion: 'v22.12.0',
      platform: 'linux',
    });
  });

  it('默认读取真实 process', () => {
    const health = impl.getRuntimeHealth();

    expect(health.pid).toBe(process.pid);
    expect(health.nodeVersion).toBe(process.version);
    expect(health.rssMb).toBeGreaterThan(0);
    expect(health.uptimeSeconds).toBeGreaterThanOrEqual(0);
  });
});
