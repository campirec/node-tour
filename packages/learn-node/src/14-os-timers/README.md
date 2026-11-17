# 14 · os 与 timers

> 目标：读取系统信息，使用 Promise 化定时器与可取消延迟。

## 模块简介

`node:os` 提供操作系统信息，常用于健康检查、诊断日志、并发度选择。

`node:timers/promises` 提供 Promise 版定时器：

- `setTimeout(ms, value?, options?)`
- `setInterval(ms, value?, options?)`
- `scheduler.wait(ms)` / `scheduler.yield()`（Node 22+，实验性）

它们支持 `AbortSignal` 与 `{ ref: false }`。`ref: false` 的定时器不会阻止进程退出，适合后台心跳。

注意：定时器不保证精确。事件循环繁忙、系统睡眠、容器 CPU 限流都会导致漂移。需要绝对时间时使用 `performance.now()` / `Date.now()` 校正。

## 常用 API

| API | 作用 |
| --- | --- |
| `os.platform()` | `win32` / `darwin` / `linux` |
| `os.arch()` | `x64` / `arm64` 等 |
| `os.cpus()` | 逻辑 CPU 信息数组 |
| `os.totalmem()` / `os.freemem()` | 内存字节数 |
| `os.uptime()` | 系统运行秒数 |
| `os.hostname()` | 主机名 |
| `os.networkInterfaces()` | 网卡与地址 |
| `timers/promises.setTimeout` | Promise 延迟 |
| `timers/promises.setInterval` | 异步迭代器间隔 |
| `performance.now()` | 单调时钟，毫秒 |
| `process.hrtime.bigint()` | 高精度纳秒计时 |

## 常见用法

### 带取消的延迟

```ts
import { setTimeout as sleep } from 'node:timers/promises';

await sleep(1000, undefined, { signal: AbortSignal.timeout(500) });
// 500ms 后以 AbortError 拒绝
```

### 异步迭代定时器

```ts
import { setInterval } from 'node:timers/promises';

for await (const _ of setInterval(1000, undefined, { ref: false })) {
  await poll();
}
```

### 选择并发度

```ts
import { availableParallelism } from 'node:os';

const workers = Math.max(1, availableParallelism() - 1);
```

`availableParallelism()` 比 `cpus().length` 更适合容器环境（Node 18.14+）。

## 练习

| 练习 | 考点 | 提示 |
| --- | --- | --- |
| `01-system-summary.ts` | `os` 常用函数、单位换算 | GB = 1024³ |
| `02-delay.ts` | `timers/promises`、AbortSignal | 直接传 `{ signal }` |
| `03-collect-ticks.ts` | `setInterval` 异步迭代、清理 | `{ ref: false }` |
| `04-runtime-health.ts` | `process.memoryUsage`/`uptime` | 可注入假进程，便于单测 |
| `05-event-loop-lag.ts` | `monitorEventLoopDelay`、P99 | 直方图单位是纳秒 |

04–05 面向企业级可观测性：健康端点报告内存/运行时长；事件循环延迟 P99 是发现同步阻塞和 GC 压力的关键指标。

## 运行

```bash
pnpm --filter @node-tour/learn-node test:14-os-timers
pnpm --filter @node-tour/learn-node test:solutions:14-os-timers
```
