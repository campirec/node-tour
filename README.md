# node-tour

> 一个 pnpm workspace：从 Node.js 核心 API，到 NestJS 企业级后端，再到 OpenAI 兼容的 AI Agent。

- Node.js `>=22.12`，全仓 ESM
- TypeScript 6 + 严格模式
- pnpm workspace + catalog 统一版本
- 三块内容互相独立，可分别学习和运行

## 仓库结构

```
node-tour/
├── packages/
│   ├── learn-node/          # 16 个核心模块、88 道练习、337 个测试
│   │   ├── src/01-path-url/
│   │   ├── src/02-fs/
│   │   ├── ...
│   │   ├── src/16-net-dns/
│   │   └── src/shared/      # 测试加载器、临时目录
│   ├── web-service/         # NestJS 12 + 原生 node:http 企业级后端
│   │   ├── src/config/      # Zod 环境变量
│   │   ├── src/common/      # 全局异常、日志、装配
│   │   ├── src/modules/     # health、tasks
│   │   └── test/            # e2e
│   └── ai-agent/            # OpenAI 兼容 Agent + CLI
│       ├── src/agent/       # 工具调用循环、历史裁剪
│       ├── src/providers/   # OpenAI SDK 适配器
│       ├── src/tools/       # calculator、time、read_file
│       └── test/            # 离线单元 + 本地 HTTP 集成
├── tsconfig.base.json
├── pnpm-workspace.yaml
└── package.json
```

每个子包都有自己的 README：

- [learn-node](./packages/learn-node/README.md)
- [web-service](./packages/web-service/README.md)
- [ai-agent](./packages/ai-agent/README.md)

## 快速开始

```bash
# 1. 安装
pnpm install

# 2. 验证环境：参考答案 + 两个实战包的全部测试
pnpm test

# 3. 开始做题（默认是红测试，属于预期）
pnpm learn

# 4. 只跑一个模块
pnpm --filter @node-tour/learn-node test:05-stream
pnpm --filter @node-tour/learn-node test:solutions:05-stream
```

## 常用命令

| 命令 | 作用 |
| --- | --- |
| `pnpm learn` | 学习包默认模式：练习为 TODO，测试红 |
| `pnpm test:solutions` | 学习包参考答案模式，337 个测试全绿 |
| `pnpm test:exercises` | 同 `pnpm learn` |
| `pnpm test` | 全仓验证：学习答案 + web + agent |
| `pnpm typecheck` | 三个子包 `tsc --noEmit` |
| `pnpm build` | 构建 web-service 与 ai-agent |
| `pnpm dev:web` | 启动 NestJS（默认 3000） |
| `pnpm dev:agent` | 启动 Agent CLI |
| `pnpm check` | typecheck + 全部测试 |

## 学习路径

每个模块包含 3 道基础题 + 2 道企业级题。企业题覆盖：路径穿越防护、文件锁、JWT/签名 URL/API Key、优雅关闭、CSV/JSONL 流式导入、命令重试、Worker 进度、中间件与限流、熔断与分页、原子压缩、结构化日志、事件循环延迟、端口就绪等待等真实后端场景。

### 第一段：Node 基础（01–05）

`path/url` → `fs` → `Buffer` → `events` → `stream`

这一段的练习直接对应 Web 后端的日常：安全路径、原子写文件、二进制协议、事件解耦、流式处理。

### 第二段：进程与并发（06–08）

`process/CLI` → `child_process` → `worker_threads`

理解事件循环之外的世界：参数与环境变量、子进程生命周期、CPU 密集任务隔离。

### 第三段：网络（09–10、16）

`http` → `fetch` → `net/dns`

从 TCP 字节流到 HTTP 语义，再到 Web 标准 fetch：超时、重试、流式响应、连接复用。

### 第四段：平台能力（11–14）

`crypto` → `zlib` → `util` → `os/timers`

安全（密码、加密、签名）、压缩、日志工具、系统信息与可取消定时器。

### 第五段：模块系统（15）

ESM 解析、`import.meta`、CJS 互操作、模块缓存。

### 与实战包的对应关系

| Node 能力 | 在 web-service 中 | 在 ai-agent 中 |
| --- | --- | --- |
| fs / path | 配置与环境文件 | `read_file` 工具沙箱 |
| stream / http | 原生 node:http 请求生命周期 | 流式响应扩展点 |
| events | Nest 生命周期、RxJS | 工具事件回调 |
| crypto | 密码/签名扩展 | API Key 管理 |
| process | 优雅关闭、env | CLI 参数与环境 |
| worker_threads | CPU 任务卸载 | 大文件解析扩展 |
| fetch | 下游服务调用 | 模型 API 调用 |
| util | 日志与格式化 | 配置解析 |

## 工程约定

### ESM

所有包 `"type": "module"`。TypeScript 使用 `NodeNext`，相对导入必须带 `.js` 扩展名：

```ts
import { Agent } from './agent/agent.js';
```

### 版本管理

共享依赖写在 `pnpm-workspace.yaml` 的 `catalog`，子包用 `catalog:` 引用，避免版本漂移。

### 学习包的红/绿模式

- 默认 `LEARN_TARGET` 未设置：加载 `exercises/*.ts`，TODO 抛错，测试红。
- `LEARN_TARGET=solution`：加载 `exercises/solutions/*.ts`，同一组测试全绿。

答案不是复制品，而是与测试一起维护的可执行参考。

### 环境变量

- web-service：`packages/web-service/env.example` → `.env`
- ai-agent：`packages/ai-agent/env.example` → `.env`

`.env` 已被 `.gitignore` 忽略。不要提交真实密钥。

## 已验证内容

在当前环境（Node 24.22.1、pnpm 12.21.0）完成验证：

- 学习包参考答案：88 个测试文件、337 个测试全部通过
- web-service：17 个测试通过，`nest build` 成功，生产产物可启动并响应 `/api/health`、`/docs`
- ai-agent：29 个测试通过，`tsc` 构建成功，Agent 循环与 OpenAI 协议映射均有离线测试
- 全仓 `pnpm typecheck` 通过

## 技术选择说明

- **TypeScript 6**：NestJS 12 CLI 依赖 TS 6；TypeScript 7 目前缺少 Nest CLI 所需的编程式编译 API。
- **Vitest**：统一测试体验；web-service 用 `unplugin-swc` 保留装饰器元数据。
- **NestJS 12**：原生 ESM；使用官方 `@nestjs/platform-node`，直接由 `node:http` 驱动，不经过 Express/Fastify。
- **OpenAI SDK**：Agent 使用 Chat Completions 协议，兼容 DeepSeek/Qwen/Ollama；模型层通过 `ChatProvider` 隔离，便于替换。
- **pnpm catalog**：一次升级，三个包同步。

## 下一步

- 学习包：完成 TODO 后开启 `pnpm learn:watch`，按模块推进
- web-service：接数据库、认证、限流、结构化日志、Docker
- ai-agent：流式输出、会话持久化、并行工具、RAG、评测与追踪
