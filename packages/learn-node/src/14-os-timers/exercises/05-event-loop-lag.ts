import { monitorEventLoopDelay } from 'node:perf_hooks';
import { setTimeout as sleep } from 'node:timers/promises';

/**
 * 企业级练习：测量事件循环延迟。
 *
 * 场景：Node 服务 P99 抖动、定时任务不准、CPU 密集任务阻塞事件循环。
 * 事件循环延迟持续升高，通常意味着同步 CPU 任务或 GC 压力。
 *
 * 要求：
 * - 使用 perf_hooks.monitorEventLoopDelay；
 * - 采样 durationMs，resolutionMs 控制直方图精度；
 * - 返回 p50/p99/max（毫秒）与样本数；
 * - 结果保留 3 位小数且不为负；
 * - 参数必须是正数；
 * - 无论成功失败都 disable 直方图。
 */
export interface EventLoopLagStats {
  p50Ms: number;
  p99Ms: number;
  maxMs: number;
  samples: number;
}

export async function measureEventLoopLag(
  durationMs = 100,
  resolutionMs = 10,
): Promise<EventLoopLagStats> {
  // TODO
  throw new Error('TODO: measureEventLoopLag');
}
