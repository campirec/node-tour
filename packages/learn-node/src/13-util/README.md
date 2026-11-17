# 13 · util

> 目标：掌握 Node 的实用工具：Promise 化、日志格式化、参数与环境解析。

## 模块简介

`node:util` 是标准库的瑞士军刀：

- `promisify` / `callbackify`：回调与 Promise 互转；
- `inspect`：安全的调试输出，支持循环引用、BigInt、Map/Set；
- `parseArgs`：命令行参数解析；
- `parseEnv`：`.env` 文本解析（Node 20.12+）；
- `types`：可靠的类型判断（`isProxy`、`isTypedArray` 等）；
- `styleText`：终端颜色（Node 20.12+）；
- `format`：`printf` 风格格式化；
- `deprecate`：标记废弃 API。

## 常用 API

| API | 作用 |
| --- | --- |
| `promisify(fn)` | 回调 `(err, result)` → Promise |
| `callbackify(fn)` | Promise → 回调 |
| `inspect(value, options)` | 调试字符串，`depth` 控制递归 |
| `format('%s=%d', ...)` | 类似 printf |
| `parseArgs(config)` | 严格 CLI 解析 |
| `parseEnv(text)` | 解析 .env 内容 |
| `types.isPromise/isProxy/isTypedArray` | 跨 realm 安全的类型判断 |
| `styleText(['red', 'bold'], text)` | 终端样式 |
| `deprecate(fn, message)` | 首次调用打印警告 |

## 常见用法

### promisify

```ts
import { promisify } from 'node:util';
import { readFile } from 'node:fs';

const readFileAsync = promisify(readFile);
const text = await readFileAsync('config.json', 'utf8');
```

自定义 Promise 化行为：

```ts
import { promisify } from 'node:util';

function legacy(callback: (err: Error | null, value?: number) => void) {
  callback(null, 42);
}
legacy[promisify.custom] = async () => 42;
```

### 日志输出

```ts
import { inspect } from 'node:util';

console.log(inspect(value, { depth: 4, colors: false }));
```

生产环境更推荐结构化日志（pino），把对象直接作为字段，而不是拼接字符串。

### .env

```ts
import { parseEnv } from 'node:util';

const parsed = parseEnv(await readFile('.env', 'utf8'));
```

注意：`parseEnv` 不会展开变量，也不会写入 `process.env`。

## 练习

| 练习 | 考点 | 提示 |
| --- | --- | --- |
| `01-read-utf8.ts` | `promisify` | 保留原始错误 |
| `02-stringify-for-log.ts` | `inspect` | 循环引用、BigInt、截断 |
| `03-parse-dotenv.ts` | `parseEnv` | 只解析，不修改 process.env |
| `04-retry.ts` | 通用重试、退避、jitter、Abort | shouldRetry 控制可重试错误 |
| `05-json-logger.ts` | 结构化日志、脱敏、Error/循环引用 | 保留 time/level/msg 字段 |

04–05 面向企业级韧性与可观测性：重试要区分可重试错误并加入抖动；容器日志应为单行 JSON，且递归脱敏密码、token、Authorization。

## 运行

```bash
pnpm --filter @node-tour/learn-node test:13-util
pnpm --filter @node-tour/learn-node test:solutions:13-util
```
