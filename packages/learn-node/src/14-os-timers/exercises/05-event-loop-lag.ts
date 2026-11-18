import { monitorEventLoopDelay } from 'node:perf_hooks';
import { setTimeout as sleep } from 'node:timers/promises';

/**
 * 企业级练习：测量事件循环延迟
 *
 * 场景：Node 服务 P99 抖动、定时任务不准、CPU 密集任务阻塞事件循环。
 * 事件循环延迟持续升高通常意味着同步 CPU 任务或 GC 压力。需要用
 * perf_hooks.monitorEventLoopDelay 采样后返回分位数统计。
 *
 * 函数签名
 *   measureEventLoopLag(durationMs?: number, resolutionMs?: number): Promise<EventLoopLagStats>
 *   - durationMs：采样持续时间，默认 100，必须是正数
 *   - resolutionMs：直方图精度，默认 10，必须是正数
 *   - 返回：{ p50Ms, p99Ms, maxMs, samples }，延迟值单位毫秒
 *
 * 示例
 *   measureEventLoopLag(60, 5)
 *   => { p50Ms: 0.123, p99Ms: 1.456, maxMs: 2.789, samples: 12 }
 *
 *   measureEventLoopLag(0)         => 抛 RangeError
 *   measureEventLoopLag(10, 0)     => 抛 RangeError
 *   measureEventLoopLag(NaN)       => 抛 RangeError
 *
 * 要求
 *   1. 使用 perf_hooks.monitorEventLoopDelay({ resolution: resolutionMs })；
 *   2. enable 直方图后采样 durationMs，采样完毕 disable；
 *   3. 无论成功还是失败都在 finally 中 disable 直方图；
 *   4. 返回 p50Ms、p99Ms（来自 percentile）、maxMs（来自 max）和 samples（来自 count）；
 *   5. 延迟值由纳秒换算为毫秒，保留 3 位小数且不为负（Math.max(0, ...)）；
 *   6. durationMs 和 resolutionMs 必须是正数（Number.isFinite && > 0），否则抛 RangeError。
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
