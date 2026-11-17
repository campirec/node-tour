import {
  arch,
  cpus,
  freemem,
  hostname,
  platform,
  totalmem,
  uptime,
} from 'node:os';

/**
 * 练习 1：汇总系统信息。
 *
 * 场景：健康检查、诊断接口、部署环境日志。
 *
 * 要求：
 * - platform/arch/hostname 来自 os；
 * - cpuCount 是逻辑 CPU 数；
 * - 内存以 GB 为单位，保留 1 位小数；
 * - uptimeSeconds 取整。
 */
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
  // TODO
  throw new Error('TODO: getSystemSummary');
}
