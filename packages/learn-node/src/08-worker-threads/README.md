# 08 · worker_threads

> 目标：把 CPU 密集任务移出主线程，并掌握 Worker 通信、池化与零拷贝。

## 模块简介

Node 是单线程事件循环。同步 CPU 任务（大 JSON 解析、图片处理、加密暴力计算、复杂规则）会阻塞所有请求。`worker_threads` 提供真正的并行线程。

选择：

- I/O 密集：继续用异步 API，不要开 Worker。
- CPU 密集：Worker。
- 需要进程隔离/崩溃隔离：`child_process.fork` 或独立服务。
- 跨线程共享大块内存：`SharedArrayBuffer`。
- 转移所有权避免复制：`postMessage(value, [transferList])`。

## 常用 API

| API | 作用 |
| --- | --- |
| `new Worker(url, { workerData })` | 创建线程；url 可以是 `.mjs`/`.js` 路径 |
| `workerData` | 启动参数，结构化克隆 |
| `parentPort.postMessage` | 子线程发消息 |
| `parentPort.on('message')` | 子线程收消息 |
| `worker.postMessage` / `worker.on('message')` | 主线程通信 |
| `MessageChannel` / `MessagePort` | 独立通信通道，可传给 Worker |
| `transferList` | 转移 ArrayBuffer 所有权，原线程 byteLength 变 0 |
| `SharedArrayBuffer` + `Atomics` | 共享内存与同步 |
| `worker.terminate()` | 强制终止 |
| `isMainThread` | 同一文件区分主线程/子线程入口 |

## 常见用法

### 一次性计算

```js
// worker.mjs
import { parentPort, workerData } from 'node:worker_threads';
parentPort.postMessage(workerData.n * 2);
```

```ts
const worker = new Worker(new URL('./worker.mjs', import.meta.url), {
  workerData: { n: 21 },
});
const result = await new Promise((resolve) => worker.once('message', resolve));
```

### 转移大 Buffer

```ts
const channel = new MessageChannel();
channel.port2.once('message', (buffer: ArrayBuffer) => {
  console.log(buffer.byteLength);
});
channel.port1.postMessage(buffer, [buffer]);
console.log(buffer.byteLength); // 0，所有权已转移
```

### 池化

为每个任务新建线程开销很大。常驻 Worker 池监听消息，按任务 ID 回传结果；练习 2 是一个最小实现。

### 注意

- Worker 里的异常不会自动传播到主线程，必须监听 `error`。
- Worker 会保持进程存活，完成后要 `terminate()` 或让它自然退出。
- `workerData` 是克隆，不是共享引用。
- Worker 中不能共享 socket / 数据库连接等句柄。

## 练习

| 练习 | 考点 | 提示 |
| --- | --- | --- |
| `01-run-worker.ts` | Worker 生命周期、超时 | 监听 message/error/exit |
| `02-worker-pool.ts` | 池化、按 id 回填、terminate | 每个 worker 完成后再领任务 |
| `03-transfer-buffer.ts` | MessageChannel、transferList | 转移后原 buffer byteLength 为 0 |
| `04-parse-json-in-worker.ts` | 大 JSON 解析卸载 | 同步 CPU 任务不能留在主线程 |
| `05-worker-progress.ts` | 进度消息、超时、回调异常 | 进度与结果共用消息协议 |

04–05 面向企业级吞吐与可观测性：大批量导入的 JSON.parse 应移出事件循环；长任务需要进度反馈、超时和取消。

## 运行

```bash
pnpm --filter @node-tour/learn-node exec vitest run src/08-worker-threads
pnpm --filter @node-tour/learn-node test:solutions:file src/08-worker-threads
```
