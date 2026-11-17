export interface RuntimeHealth {
  pid: number;
  uptimeSeconds: number;
  rssMb: number;
  heapUsedMb: number;
  heapTotalMb: number;
  externalMb: number;
  nodeVersion: string;
  platform: NodeJS.Platform;
}

export interface ProcessMetricsSource {
  pid: number;
  version: string;
  platform: NodeJS.Platform;
  uptime(): number;
  memoryUsage(): NodeJS.MemoryUsage;
}

const MB = 1024 * 1024;

function toMb(bytes: number): number {
  return Math.round((bytes / MB) * 10) / 10;
}

export function getRuntimeHealth(
  source: ProcessMetricsSource = process,
): RuntimeHealth {
  const memory = source.memoryUsage();
  return {
    pid: source.pid,
    uptimeSeconds: Math.round(source.uptime()),
    rssMb: toMb(memory.rss),
    heapUsedMb: toMb(memory.heapUsed),
    heapTotalMb: toMb(memory.heapTotal),
    externalMb: toMb(memory.external),
    nodeVersion: source.version,
    platform: source.platform,
  };
}
