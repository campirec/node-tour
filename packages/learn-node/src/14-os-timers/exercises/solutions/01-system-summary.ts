import {
  arch,
  cpus,
  freemem,
  hostname,
  platform,
  totalmem,
  uptime,
} from 'node:os';

export interface SystemSummary {
  platform: NodeJS.Platform;
  arch: string;
  cpuCount: number;
  totalMemoryGb: number;
  freeMemoryGb: number;
  hostname: string;
  uptimeSeconds: number;
}

const GB = 1024 ** 3;

function roundGb(bytes: number): number {
  return Math.round((bytes / GB) * 10) / 10;
}

export function getSystemSummary(): SystemSummary {
  return {
    platform: platform(),
    arch: arch(),
    cpuCount: cpus().length,
    totalMemoryGb: roundGb(totalmem()),
    freeMemoryGb: roundGb(freemem()),
    hostname: hostname(),
    uptimeSeconds: Math.round(uptime()),
  };
}
