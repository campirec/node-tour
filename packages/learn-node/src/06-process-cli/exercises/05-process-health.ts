/**
 * 企业级练习：进程健康快照与预算检查。
 *
 * 场景：/health 端点报告内存与运行时长；告警规则在内存或运行时长超过阈值时触发。
 *
 * 要求：
 * - 默认读取真实 process，也可注入假数据用于测试；
 * - 内存换算为 MB 并保留 1 位小数；uptime 取整；
 * - isOverBudget 返回 { over, reasons }，reasons 包含 rss/heapUsed/uptime；
 * - budget 字段必须是非负有限数字，否则抛 RangeError。
 */
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

export function getProcessHealth(source: ProcessLike = process): ProcessHealth {
  // TODO
  throw new Error('TODO: getProcessHealth');
}

export function isOverBudget(
  health: ProcessHealth,
  budget: HealthBudget,
): { over: boolean; reasons: string[] } {
  // TODO
  throw new Error('TODO: isOverBudget');
}
