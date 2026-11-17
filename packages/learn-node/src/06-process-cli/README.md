# 06 · process 与 CLI

> 目标：读取 argv/env/stdin，写出可预期、可测试、可优雅退出的命令行程序。

## 模块简介

`process` 是全局对象，不需要 import。常用能力：

- `process.argv`：`[node 路径, 脚本路径, ...参数]`
- `process.env`：环境变量（值永远是字符串或 undefined）
- `process.stdin/stdout/stderr`：标准流
- `process.exitCode`：设置退出码并让事件循环自然结束
- `process.exit()`：立即退出，可能丢失未 flush 的输出，慎用
- `process.on('SIGINT'/'SIGTERM')`：优雅关闭钩子
- `process.hrtime.bigint()` / `performance.now()`：高精度计时
- `process.memoryUsage()` / `process.uptime()`

解析参数优先用 `node:util` 的 `parseArgs`，不要自己写正则。

## 常用 API

| API | 作用 |
| --- | --- |
| `util.parseArgs` | 严格解析 `--flag`、`--key=value`、短选项、位置参数 |
| `process.argv.slice(2)` | 获取业务参数 |
| `process.stdin` | 可读流；`for await` 读取 |
| `process.stdout.write` | 写标准输出，不自动换行 |
| `process.exitCode = 1` | 推荐退出方式 |
| `process.once('SIGTERM', ...)` | 关闭服务器/数据库连接 |
| `process.cwd()` | 当前工作目录，不是脚本目录 |
| `process.platform` / `arch` / `version` | 运行环境信息 |

## 常见用法

### 最小 CLI

```ts
import { parseArgs } from 'node:util';

const { values, positionals } = parseArgs({
  args: process.argv.slice(2),
  options: {
    port: { type: 'string', default: '3000' },
    verbose: { type: 'boolean', short: 'v' },
  },
  allowPositionals: true,
});
```

### 读取管道输入

```ts
const chunks: Buffer[] = [];
for await (const chunk of process.stdin) {
  chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
}
const input = Buffer.concat(chunks).toString('utf8');
```

### 优雅退出

```ts
process.once('SIGTERM', async () => {
  await server.close();
  await db.destroy();
  process.exitCode = 0;
});
```

### 环境变量脱敏

```ts
const safeEnv = Object.fromEntries(
  Object.entries(process.env).filter(([key]) => !/SECRET|TOKEN|PASSWORD|KEY/.test(key)),
);
```

## 练习

| 练习 | 考点 | 提示 |
| --- | --- | --- |
| `01-parse-cli.ts` | `util.parseArgs` | `strict: true`，端口范围校验 |
| `02-read-all.ts` | stdin 异步迭代、字节上限 | 先收集 Buffer 再解码 |
| `03-redact-env.ts` | `process.env`、安全日志 | 按 `_` 分段匹配，避免误伤 MONKEY |
| `04-parse-size-duration.ts` | 容量/时长配置解析 | 1024 进制；溢出用安全整数检查 |
| `05-process-health.ts` | `memoryUsage`/`uptime`、预算告警 | 可注入假进程，便于单测 |

04–05 面向企业级配置与运维：`MAX_UPLOAD=10MB`、`TIMEOUT=30s` 应在启动时解析失败；健康端点要提供可告警的内存/运行时长指标。

## 运行

```bash
pnpm --filter @node-tour/learn-node exec vitest run src/06-process-cli
pnpm --filter @node-tour/learn-node test:solutions:file src/06-process-cli
```
