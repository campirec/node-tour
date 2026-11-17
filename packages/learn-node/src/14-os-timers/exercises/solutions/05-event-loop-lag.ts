import { monitorEventLoopDelay } from 'node:perf_hooks';
import { setTimeout as sleep } from 'node:timers/promises';

export interface EventLoopLagStats {
  p50Ms: number;
  p99Ms: number;
  maxMs: number;
  samples: number;
}

function toMs(nanoseconds: number): number {
  return Math.round(Math.max(0, nanoseconds / 1e6) * 1000) / 1000;
}

export async function measureEventLoopLag(
  durationMs = 100,
  resolutionMs = 10,
): Promise<EventLoopLagStats> {
  if (!Number.isFinite(durationMs) || durationMs <= 0) {
    throw new RangeError('durationMs 必须是正数');
  }
  if (!Number.isFinite(resolutionMs) || resolutionMs <= 0) {
    throw new RangeError('resolutionMs 必须是正数');
  }

  const histogram = monitorEventLoopDelay({ resolution: resolutionMs });
  histogram.enable();
  try {
    await sleep(durationMs);
  } finally {
    histogram.disable();
  }

  return {
    p50Ms: toMs(histogram.percentile(50)),
    p99Ms: toMs(histogram.percentile(99)),
    maxMs: toMs(histogram.max),
    samples: histogram.count,
  };
}
