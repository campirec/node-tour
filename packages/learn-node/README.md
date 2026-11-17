# learn-node · Node.js 核心模块练习

> 16 个核心模块，88 道场景练习题，337 个单元测试。  
> 每个模块 = 模块导览 + 常用 API + 用法示例 + 基础练习 + 企业级练习 + 参考答案。

## 快速开始

```bash
# 在仓库根目录
pnpm install

# 默认模式：练习题为 TODO，测试呈红色
pnpm learn

# 参考答案模式：用同一组测试验证答案，应全绿
pnpm test:solutions
```

只跑某个模块：

```bash
# 每个模块都有对应的测试命令，模块名与 src/ 下的目录一致
pnpm --filter @node-tour/learn-node test:05-stream
pnpm --filter @node-tour/learn-node test:solutions:05-stream
```

## 两种模式如何工作

每道练习由三个文件组成：

```
exercises/
  01-line-splitter.ts            # 题面 + TODO
  solutions/01-line-splitter.ts  # 参考答案
  tests/01-line-splitter.test.ts # 同一组测试
```

测试通过 `src/shared/load-impl.ts` 选择实现：

- `LEARN_TARGET` 未设置 → 加载 `exercise.ts`，初始为红；
- `LEARN_TARGET=solution` → 加载 `solutions/*.ts`，用于验证答案与测试一致。

这样答案不会和测试脱节，也方便你写完对照。

## 模块索引

| # | 模块 | 核心 API | 5 道练习 |
| --- | --- | --- | --- |
| 01 | [path 与 URL](./src/01-path-url/README.md) | `path`、`fileURLToPath`、`URL`、`URLSearchParams` | 模块相对路径、查询参数、路径拆解、**安全路径约束**、**分页链接** |
| 02 | [fs 文件系统](./src/02-fs/README.md) | `fs/promises`、`readdir`、`rename`、`rm` | 原子 JSON 写、递归遍历、过期清理、**文件锁**、**日志尾部读取**、**文件变化监听** |
| 03 | [Buffer](./src/03-buffer/README.md) | `Buffer.from/concat/subarray`、`readUInt32BE` | 长度前缀协议、base64url、二进制切分、**JWT 解析**、**游标编解码** |
| 04 | [events](./src/04-events/README.md) | `EventEmitter`、`events.once/on` | 等待事件、收集事件、事件转发、**优雅关闭**、**事件批处理**、**幂等键防重** |
| 05 | [stream](./src/05-stream/README.md) | `Transform`、`pipeline`、`StringDecoder` | 行切分、字节统计、NDJSON、**CSV 导入**、**流式哈希**、**并发限制** |
| 06 | [process 与 CLI](./src/06-process-cli/README.md) | `process.argv/env/stdin`、`parseArgs` | 参数解析、stdin 上限、env 脱敏、**容量/时长解析**、**进程健康** |
| 07 | [child_process](./src/07-child-process/README.md) | `execFile`、`spawn`、AbortSignal | 命令封装、流式输出、取消、**命令重试**、**输出落日志** |
| 08 | [worker_threads](./src/08-worker-threads/README.md) | `Worker`、`workerData`、`MessageChannel` | 一次性 Worker、Worker 池、零拷贝转移、**大 JSON 卸载**、**进度上报** |
| 09 | [http](./src/09-http/README.md) | `createServer`、`http.request` | 请求体解析、JSON 服务、HTTP 客户端、**中间件链**、**限流器** |
| 10 | [fetch](./src/10-fetch/README.md) | `fetch`、`AbortSignal.timeout`、ReadableStream | JSON 客户端、重试、流式行、**熔断器**、**游标分页**、**SSE 解析** |
| 11 | [crypto](./src/11-crypto/README.md) | `scrypt`、AES-GCM、HMAC、`timingSafeEqual` | 密码哈希、加密解密、Webhook 签名、**签名 URL**、**API Key**、**PBKDF2** |
| 12 | [zlib](./src/12-zlib/README.md) | `gzip`、`createGzip`、Brotli | Buffer 压缩、流式压缩、Content-Encoding、**原子压缩文件**、**JSONL.gz**、**流式上传** |
| 13 | [util](./src/13-util/README.md) | `promisify`、`inspect`、`parseEnv` | 回调 Promise 化、日志字符串、.env 解析、**通用重试**、**JSON 日志器** |
| 14 | [os 与 timers](./src/14-os-timers/README.md) | `os`、`timers/promises`、`perf_hooks` | 系统信息、可取消延迟、异步定时器、**运行时健康**、**事件循环延迟**、**超时包装** |
| 15 | [ESM](./src/15-esm/README.md) | `import.meta`、`createRequire`、动态 import | 入口判断、缓存破坏、CJS 互操作、**插件加载**、**惰性单例** |
| 16 | [net 与 dns](./src/16-net-dns/README.md) | `net.createServer`、`dns.lookup` | TCP echo、IP 分类、主机名解析、**空闲端口**、**端口就绪等待**、**TCP 分帧解码** |

加粗的是企业级练习（每模块 04、05 题）。

## 企业级场景覆盖

这 32 道企业级练习不是语法题，而是后端/Agent 服务里真实会遇到的问题：

| 领域 | 对应练习 |
| --- | --- |
| 安全 | 路径穿越、JWT 解析、AES-GCM、HMAC、签名 URL、API Key、日志脱敏 |
| 可靠性 | 命令重试、fetch 重试、熔断器、文件锁、优雅关闭、幂等游标、**幂等键防重**、**超时包装** |
| 数据与吞吐 | 大 JSON 卸载到 Worker、CSV 流式导入、流式哈希、原子压缩、JSONL.gz、**并发限制**、**流式上传** |
| 生命周期 | 关闭钩子、超时、AbortSignal、端口就绪等待、空闲端口 |
| 可观测性 | 进程健康、事件循环延迟、结构化 JSON 日志、进度上报 |
| API 契约 | 分页链接、不透明游标、中间件链、固定窗口限流、**SSE 解析** |
| 实时通信 | **SSE 流式解析**、**TCP 分帧解码** |
| 文件系统 | **文件变化监听**（fs.watch）、原子写、大文件尾部读取 |
| 密码学 | **PBKDF2 密钥派生**、scrypt、AES-GCM、HMAC |

## 建议学习顺序

1. **基础**：01 path/url → 02 fs → 03 Buffer → 04 events → 05 stream
2. **进程与并发**：06 process/CLI → 07 child_process → 08 worker_threads
3. **网络**：09 http → 10 fetch → 16 net/dns
4. **平台能力**：11 crypto → 12 zlib → 13 util → 14 os/timers
5. **模块系统**：15 ESM

如果你直接目标是 Web 后端与 AI Agent，至少优先完成 01–10、13、15；11 与 12 是安全与性能的必备基础。建议先做 01–03 基础题，再直接挑战 04–05 企业题，遇到缺口再回看模块 README。

## 如何做题

1. 先读模块 `README.md`，运行示例代码（`tsx` 可直接执行 TS）。
2. 打开 `exercises/xx.ts`，根据 TODO 与 JSDoc 实现。
3. 跑单文件测试：

   ```bash
   pnpm --filter @node-tour/learn-node test:file src/02-fs
   ```

4. 卡住时先看测试断言，再对照 `solutions/`。
5. 全部完成后：

   ```bash
   pnpm --filter @node-tour/learn-node typecheck
   pnpm --filter @node-tour/learn-node test:solutions
   ```

## 约定

- 全部使用 ESM（`"type": "module"`），相对导入必须带 `.js` 扩展名。
- 目标 Node `>=22.12`；本地已用 Node 24 验证。
- 测试框架为 Vitest，测试统一放在对应模块的 `exercises/tests/` 目录。
- 需要临时文件的测试使用 `src/shared/temp.ts`，自动清理。
- 参考答案也参与类型检查，不能靠 `any` 蒙混。
- 企业级练习中的时间、随机数、进程指标大多可注入，测试不依赖真实时钟或外部服务。

## 新增模块

复制任意模块目录，保持以下结构：

```
src/17-your-topic/
  README.md
  exercises/
    01-task.ts
    solutions/01-task.ts
    tests/01-task.test.ts
```

测试开头使用：

```ts
const impl = await loadImpl({
  exercise: () => import('../01-task.js'),
  solution: () => import('../solutions/01-task.js'),
});
```

然后运行 `test:solutions:file` 确认答案能通过自己写的测试。
