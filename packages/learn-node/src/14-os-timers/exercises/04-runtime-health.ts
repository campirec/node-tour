/**
 * 企业级练习：运行时健康快照
 *
 * 场景：容器编排的健康/存活探针、内存泄漏巡检、值班面板。需要从 process
 * 读取 PID、版本、平台、运行时间和内存占用，汇总为结构化快照。
 *
 * 函数签名
 *   getRuntimeHealth(source?: ProcessMetricsSource): RuntimeHealth
 *   - source：可注入的 process-like 对象，默认读取真实 process
 *   - 返回：包含 pid、uptimeSeconds、rssMb、heapUsedMb、heapTotalMb、
 *     externalMb、nodeVersion、platform 的对象
 *
 * 示例
 *   getRuntimeHealth(fake)  // fake.uptime() = 7200.6, memoryUsage 返回字节
 *   => { pid: 999, uptimeSeconds: 7201, rssMb: 256.1, heapUsedMb: 100,
 *        heapTotalMb: 180, externalMb: 12, nodeVersion: 'v22.12.0', platform: 'linux' }
 *
 *   getRuntimeHealth()  // 默认读取真实 process
 *   => { pid: process.pid, nodeVersion: process.version, ... }
 *
 * 要求
 *   1. 默认读取真实 process，也可注入 ProcessMetricsSource 用于测试；
 *   2. 内存换算为 MB 并保留 1 位小数（Math.round(bytes / MB * 10) / 10）；
 *   3. uptimeSeconds 取整（Math.round）；
 *   4. 返回 pid（source.pid）、nodeVersion（source.version）、platform（source.platform）。
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
