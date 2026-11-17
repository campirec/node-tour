# 01 · path 与 URL

> 目标：跨平台处理文件路径与 URL，不再用字符串拼接路径，也不再手工拼查询参数。

## 模块简介

Node 里有两套"位置"：

- `node:path`：操作系统文件路径。Windows 用 `\`，POSIX 用 `/`，还涉及盘符、UNC 路径。
- `node:url` / 全局 `URL`：URL 与 file URL。`import.meta.url` 是 `file://` 形式的 URL，不能直接交给 `fs`。

常见事故：

```js
// 错误：Windows 下得到 C:\app/src\config.json，且没有处理空格
const file = __dirname + '/../config.json';
```

ESM 没有 `__dirname` / `__filename`，应使用 `import.meta.url`。Node 20.11+ 也可以直接用 `import.meta.dirname` / `import.meta.filename`。

## 常用 API

| API | 作用 |
| --- | --- |
| `path.join(...parts)` | 拼接路径并规范化分隔符，不解析为绝对路径 |
| `path.resolve(...parts)` | 从右往左解析，直到得到绝对路径（会使用 `process.cwd()`） |
| `path.dirname` / `basename` / `extname` | 取目录 / 文件名 / 扩展名 |
| `path.parse` / `format` | 结构体与字符串互转 |
| `path.relative(from, to)` | 计算相对路径 |
| `path.isAbsolute` | 判断是否为绝对路径 |
| `path.sep` | 当前平台分隔符 |
| `fileURLToPath(url)` | file URL → 本地路径 |
| `pathToFileURL(path)` | 本地路径 → file URL |
| `new URL(input, base?)` | 解析/构造 URL，自动编码与规范化 |
| `url.searchParams` | `URLSearchParams`，支持 get/set/append/delete/遍历 |

## 常见用法

### 从模块位置读取资源

```ts
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const template = await readFile(resolve(here, '../templates/mail.html'), 'utf8');
```

等价的现代写法（Node 22 可用）：

```ts
const templatePath = new URL('../templates/mail.html', import.meta.url);
const template = await readFile(templatePath, 'utf8');
```

### 拼接查询参数

```ts
const url = new URL('https://api.example.com/v1/tasks');
url.searchParams.set('status', 'done');
url.searchParams.append('tag', 'node');
url.searchParams.append('tag', 'ts');
console.log(url.toString());
// https://api.example.com/v1/tasks?status=done&tag=node&tag=ts
```

### 解析并校验回调 URL

```ts
const callback = new URL(request.url ?? '', 'http://localhost');
const code = callback.searchParams.get('code');
const state = callback.searchParams.get('state');
```

## 练习

| 练习 | 考点 | 提示 |
| --- | --- | --- |
| `01-resolve-module-path.ts` | `fileURLToPath`、`dirname`、`resolve` | 先把 URL 转文件路径，再基于目录解析 |
| `02-build-url.ts` | `URL`、`URLSearchParams` | 数组用 `append`，不要用对象转字符串 |
| `03-inspect-path.ts` | `parse`、`relative`、`sep` | `resolve` 后的路径才用于拆解，`isAbsolute` 看原始输入 |
| `04-safe-resolve.ts` | 路径穿越防护 | `resolve` 后比较根目录前缀；Windows 忽略大小写 |
| `05-pagination-links.ts` | API 分页链接 | 保留筛选参数；页码越界钳制到最后一页 |

04–05 面向企业级安全与 API 契约：用户传入的路径必须先做根目录约束；分页链接要保留筛选条件并可被调用方直接使用。

## 运行

```bash
# 只跑本模块（红测）
pnpm --filter @node-tour/learn-node test:01-path-url

# 看参考答案是否通过同一组测试
pnpm --filter @node-tour/learn-node test:solutions:01-path-url
```

完成后把 `exercises/*.ts` 里的 `TODO` 实现掉，测试应全部变绿。参考答案在 `exercises/solutions/`，建议先自己写再对照。
