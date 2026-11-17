# 15 · ESM 模块系统

> 目标：写正确的 ESM 代码，理解解析规则，并处理与 CommonJS 的互操作。

## 模块简介

在 `package.json` 设置 `"type": "module"` 后，`.js` 文件按 ESM 解析。

ESM 与 CJS 的关键区别：

| 特性 | ESM | CJS |
| --- | --- | --- |
| 导入 | `import` / `import()` | `require()` |
| 导出 | `export` | `module.exports` |
| 加载 | 静态分析、异步 | 运行时、同步 |
| 顶层 await | 支持 | 不支持 |
| `__dirname` | 无，用 `import.meta.url` / `import.meta.dirname` | 有 |
| 相对导入扩展名 | 必须写 `.js` | 可省略 |
| 缓存键 | URL（含 query） | 文件路径 |

## 常用 API / 语法

| 语法 | 作用 |
| --- | --- |
| `import.meta.url` | 当前模块的 file URL |
| `import.meta.dirname` / `filename` | Node 20.11+ 的目录/文件名 |
| `await import('./x.js')` | 动态导入，可条件加载 |
| `import data from './x.json' with { type: 'json' }` | JSON import attributes |
| `createRequire(import.meta.url)` | 在 ESM 中创建 require |
| `export default` / `export {}` | 导出 |
| `export * from` / `export { x } from` | 再导出 |
| `import type` | 仅类型导入，运行时擦除 |

## 常见用法

### __dirname 的替代

```ts
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
// 或者 Node 22:
const currentDir = import.meta.dirname;
```

### 动态导入

```ts
const plugin = await import(`./plugins/${name}.js`);
await plugin.register(app);
```

### JSON

```ts
import pkg from './package.json' with { type: 'json' };
```

### CJS 互操作

```ts
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const legacy = require('legacy-package');
```

导入 CJS 默认导出时通常得到 `module.exports`：

```ts
import express from 'express'; // express 是 CJS
```

### 判断入口

```ts
import { pathToFileURL } from 'node:url';

if (import.meta.url === pathToFileURL(process.argv[1]!).href) {
  main();
}
```

## 练习

| 练习 | 考点 | 提示 |
| --- | --- | --- |
| `01-is-main-module.ts` | `import.meta.url`、`pathToFileURL` | argv[1] 可能不存在 |
| `02-with-cache-bust.ts` | 模块 URL 缓存 | `searchParams.set` |
| `03-require-from-esm.ts` | `createRequire` | 相对路径基于 metaUrl |
| `04-load-plugin.ts` | 动态 import、插件契约校验 | 只加载可信插件；保留 cause |
| `05-lazy-module.ts` | 惰性单例、失败重试 | 缓存 Promise；reset 清空 |

04–05 面向企业级扩展与启动性能：插件系统通过动态 import 加载并做结构校验；数据库/SDK 客户端使用惰性单例，避免启动时串行阻塞，同时支持失败重试。

## 运行

```bash
pnpm --filter @node-tour/learn-node test:15-esm
pnpm --filter @node-tour/learn-node test:solutions:15-esm
```
