# 04 · events

> 目标：用 `EventEmitter` 组织解耦的事件流，并写出不泄漏监听器的异步代码。

## 模块简介

Node 的很多核心对象都是事件发射器：`http.Server`、`net.Socket`、`stream.Readable`、`ChildProcess`、`Worker`。

```ts
import { EventEmitter } from 'node:events';

const bus = new EventEmitter();
bus.on('order.created', (order) => console.log(order.id));
bus.emit('order.created', { id: 'A-1' });
```

`emit` 是同步调用：所有监听器按注册顺序执行，异常会向上抛。默认最多 10 个监听器，超过会打印警告（通常意味着泄漏）。

`error` 事件是特殊的：没有监听器时 `emit('error')` 会抛出，直接导致进程崩溃。

## 常用 API

| API | 作用 |
| --- | --- |
| `on` / `addListener` | 注册监听器 |
| `once` | 只触发一次，自动移除 |
| `off` / `removeListener` | 移除监听器；必须传同一个函数引用 |
| `emit` | 同步触发 |
| `listenerCount` | 调试泄漏 |
| `setMaxListeners(n)` | 调整警告阈值，不是硬限制 |
| `events.once(emitter, name, opts)` | Promise 版，支持 `signal` |
| `events.on(emitter, name, opts)` | 异步迭代器，支持 `signal` |
| `events.getEventListeners` | 只读查看监听器 |
| `emitter.captureRejections` | 把 async 监听器的拒绝交给 `error` 事件 |

## 常见用法

### 等待一个事件

```ts
import { once } from 'node:events';

const [payload] = await once(server, 'listening', {
  signal: AbortSignal.timeout(3000),
});
```

### 异步迭代事件

```ts
import { on } from 'node:events';

for await (const [line] of on(process.stdin, 'data', { signal })) {
  if (line.toString().includes('quit')) break;
}
```

### 避免监听器泄漏

```ts
function observe(emitter: EventEmitter, event: string) {
  const listener = (value: unknown) => console.log(value);
  emitter.on(event, listener);
  return () => emitter.off(event, listener); // 调用方负责释放
}
```

长连接、请求级订阅、定时器场景一定要在 `finally` 或关闭钩子里 `off`。

## 练习

| 练习 | 考点 | 提示 |
| --- | --- | --- |
| `01-wait-for-event.ts` | `events.once`、超时、error | `AbortSignal.timeout` |
| `02-take-events.ts` | `events.on` 异步迭代 | `break` 后要 `return()` 释放 |
| `03-forward-events.ts` | 监听器管理与幂等清理 | 用 Map 保存 listener 引用 |
| `04-shutdown-manager.ts` | 优雅关闭、超时、错误聚合 | LIFO；AggregateError；幂等 |
| `05-batch-events.ts` | 事件批处理、定时 flush | 串行 flush 链，避免并发写 |

04–05 面向企业级生命周期与吞吐：关闭钩子要按依赖逆序执行且互不阻塞；审计/指标事件按批量或时间窗口聚合，降低 I/O 次数。

## 运行

```bash
pnpm --filter @node-tour/learn-node test:04-events
pnpm --filter @node-tour/learn-node test:solutions:04-events
```
