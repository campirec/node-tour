# 07 · child_process

> 目标：安全地启动子进程，处理输出流、退出码、超时与取消。

## 模块简介

四种启动方式：

| API | 适用场景 | 是否经过 shell |
| --- | --- | --- |
| `exec` | 简单命令、输出很小 | 是（有注入风险） |
| `execFile` | 执行已知可执行文件、参数数组 | 否 |
| `spawn` | 长输出、流式处理、长期运行 | 否 |
| `fork` | 启动 Node 子进程并使用 IPC | 否 |

业务代码优先 `execFile` / `spawn`。永远不要把用户输入拼进 shell 命令。

子进程资源必须显式管理：监听 `error`、`close`，设置超时，服务关闭时终止。

## 常用 API

| API | 作用 |
| --- | --- |
| `execFile(file, args, options)` | 收集 stdout/stderr，适合小输出 |
| `spawn(command, args, options)` | 返回 ChildProcess，流式读写 |
| `child.stdin` / `stdout` / `stderr` | 标准流；`stdio: 'pipe'/'ignore'/'inherit'` |
| `child.on('close', (code, signal))` | 进程结束，流已关闭 |
| `child.on('error')` | 启动失败（如 ENOENT） |
| `child.kill(signal)` | 发送信号；Windows 行为与 POSIX 不同 |
| `options.timeout` / `maxBuffer` | exec/execFile 的保护措施 |
| `options.windowsHide` | Windows 下隐藏控制台窗口 |
| `fork(modulePath)` | Node 子进程 + `child.send()` / `message` IPC |

## 常见用法

### 安全执行命令

```ts
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

const { stdout } = await execFileAsync('git', ['rev-parse', 'HEAD'], {
  encoding: 'utf8',
  timeout: 5000,
  maxBuffer: 1024 * 1024,
  windowsHide: true,
});
```

### 流式读取输出

```ts
const child = spawn('npm', ['run', 'build'], { stdio: ['ignore', 'pipe', 'pipe'] });
child.stdout.on('data', (chunk) => process.stdout.write(chunk));
child.stderr.on('data', (chunk) => process.stderr.write(chunk));
const code = await new Promise((resolve) => child.on('close', resolve));
```

### 取消与清理

```ts
const controller = new AbortController();
const child = spawn('long-task', [], { stdio: 'ignore' });
controller.signal.addEventListener('abort', () => child.kill('SIGTERM'), {
  once: true,
});
```

生产环境还要设置“温和终止 → 超时后强杀”的兜底逻辑。

## 练习

| 练习 | 考点 | 提示 |
| --- | --- | --- |
| `01-run-command.ts` | `execFile`、promisify、错误封装 | `encoding: 'utf8'`、`maxBuffer` |
| `02-collect-lines.ts` | `spawn`、stdout 流、stdin | 用 `StringDecoder` 处理中文 |
| `03-run-with-abort.ts` | `AbortSignal`、kill、清理 | 先 SIGTERM，再 SIGKILL 兜底 |
| `04-run-with-retry.ts` | 指数退避、错误聚合、Abort | 只重试幂等命令；最终抛 CommandRetryError |
| `05-spawn-to-log.ts` | spawn 输出落盘、超时 | stdout/stderr 合并写日志，flush 后返回 |

04–05 面向企业级部署与运维：迁移/部署脚本需要有限重试；长任务输出应持续写文件并保留失败现场，而不是塞进内存。

测试统一使用 `process.execPath` 与测试 fixture，不依赖系统安装的命令，跨平台稳定。

## 运行

```bash
pnpm --filter @node-tour/learn-node exec vitest run src/07-child-process
pnpm --filter @node-tour/learn-node test:solutions:file src/07-child-process
```
