/**
 * 企业级练习：进程健康快照与预算检查
 *
 * 场景：/health 端点报告内存与运行时长；告警规则在内存或运行时长超过阈值
 * 时触发。需要支持注入假数据用于测试。
 *
 * 函数签名
 *   getProcessHealth(source?: ProcessLike): ProcessHealth
 *   - source：进程对象，默认 process
 *   - 返回：包含 pid、uptime、内存 MB 指标、版本与平台的健康快照
 *
 *   isOverBudget(health: ProcessHealth, budget: HealthBudget):
 *     { over: boolean; reasons: string[] }
 *   - health：getProcessHealth 返回的快照
 *   - budget：{ maxRssMb, maxHeapUsedMb, maxUptimeSeconds }
 *   - 返回：over 为是否超预算，reasons 列出超限项
 *
 * 示例
 *   getProcessHealth(fakeProcess)
 *   // fakeProcess.memoryUsage().rss = 200.04 MB, uptime() = 3600.4
 *   => { pid: 4321, uptimeSeconds: 3600, rssMb: 200,
 *        heapUsedMb: 80.1, heapTotalMb: 120, externalMb: 10,
 *        nodeVersion: 'v22.12.0', platform: 'linux' }
 *
 *   isOverBudget(health, { maxRssMb: 100, maxHeapUsedMb: 50, maxUptimeSeconds: 60 })
 *   // rss、heapUsed、uptime 均超限
 *   => { over: true, reasons: ['rss', 'heapUsed', 'uptime'] }
 *
 *   isOverBudget(health, { maxRssMb: -1, ... })
 *   => 抛 RangeError
 *
 * 要求
 *   1. 默认读取真实 process，也可注入 ProcessLike 用于测试；
 *   2. 内存（rss、heapUsed、heapTotal、external）换算为 MB 并保留 1 位小数
 *      （除以 1024*1024 后保留一位小数）；
 *   3. uptime 四舍五入取整（Math.round）为 uptimeSeconds（3600.4 -> 3600）；
 *   4. pid、version（nodeVersion）、platform 直接取自 source；
 *   5. isOverBudget 逐项比较，超限项加入 reasons，顺序为 rss、heapUsed、uptime；
 *   6. 未超预算时返回 { over: false, reasons: [] }；
 *   7. budget 各字段必须是非负有限数字，否则抛 RangeError。
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
