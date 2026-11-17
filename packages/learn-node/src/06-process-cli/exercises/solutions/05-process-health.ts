export interface ProcessHealth {
  pid: number;
  uptimeSeconds: number;
  rssMb: number;
  heapUsedMb: number;
  heapTotalMb: number;
  externalMb: number;
  nodeVersion: string;
  platform: NodeJS.Platform;
}

export interface ProcessLike {
  pid: number;
  version: string;
  platform: NodeJS.Platform;
  uptime(): number;
  memoryUsage(): NodeJS.MemoryUsage;
}

export interface HealthBudget {
  maxRssMb: number;
  maxHeapUsedMb: number;
  maxUptimeSeconds: number;
}

const MB = 1024 * 1024;

function toMb(bytes: number): number {
  return Math.round((bytes / MB) * 10) / 10;
}

export function getProcessHealth(source: ProcessLike = process): ProcessHealth {
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

export function isOverBudget(
  health: ProcessHealth,
  budget: HealthBudget,
): { over: boolean; reasons: string[] } {
  for (const [field, value] of Object.entries(budget)) {
    if (!Number.isFinite(value) || value < 0) {
      throw new RangeError(`${field} 必须是非负有限数字`);
    }
  }

  const reasons: string[] = [];
  if (health.rssMb > budget.maxRssMb) {
    reasons.push('rss');
  }
  if (health.heapUsedMb > budget.maxHeapUsedMb) {
    reasons.push('heapUsed');
  }
  if (health.uptimeSeconds > budget.maxUptimeSeconds) {
    reasons.push('uptime');
  }

  return { over: reasons.length > 0, reasons };
}
