/**
 * 企业级练习：运行时健康快照。
 *
 * 场景：容器编排的健康/存活探针、内存泄漏巡检、值班面板。
 *
 * 要求：
 * - 默认读取真实 process，也可注入假数据用于测试；
 * - 内存换算为 MB 并保留 1 位小数；
 * - uptime 取整；
 * - 返回 pid、nodeVersion、platform。
 */
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

export function getRuntimeHealth(
  source: ProcessMetricsSource = process,
): RuntimeHealth {
  // TODO
  throw new Error('TODO: getRuntimeHealth');
}
