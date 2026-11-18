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
 * 练习 1：汇总系统信息
 *
 * 场景：健康检查、诊断接口、部署环境日志。需要从 node:os 读取平台、CPU、
 * 内存、主机名和运行时间，汇总为一个结构化对象。
 *
 * 函数签名
 *   getSystemSummary(): SystemSummary
 *   - 返回：包含 platform、arch、cpuCount、totalMemoryGb、freeMemoryGb、
 *     hostname、uptimeSeconds 的对象
 *
 * 示例
 *   getSystemSummary()
 *   => { platform: 'linux', arch: 'x64', cpuCount: 8,
 *        totalMemoryGb: 15.6, freeMemoryGb: 7.2,
 *        hostname: 'prod-01', uptimeSeconds: 3600 }
 *
 * 要求
 *   1. platform 与 arch 来自 os.platform() 和 os.arch()；
 *   2. cpuCount 为 os.cpus().length（逻辑 CPU 数，>= 1）；
 *   3. 内存换算为 GB 并保留 1 位小数（Math.round(bytes / GB * 10) / 10）；
 *   4. uptimeSeconds 取整（Math.round）；
 *   5. hostname 来自 os.hostname()，非空。
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
