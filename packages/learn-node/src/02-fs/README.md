# 02 · fs 文件系统

> 目标：掌握 `fs/promises` 的常用操作，写出能处理错误、并发和原子性的文件代码。

## 模块简介

`node:fs` 同时提供回调、同步、Promise 三套 API。业务代码优先使用 `node:fs/promises`：

- 不阻塞事件循环；
- 与 `async/await` 组合自然；
- 错误通过 Promise 拒绝传播。

不要在生产请求路径里使用 `readFileSync` / `writeFileSync`，它们会阻塞整个进程。

## 常用 API

| API | 作用 |
| --- | --- |
| `readFile` / `writeFile` | 读写文件，指定 `encoding: 'utf8'` 得到字符串 |
| `mkdir(path, { recursive: true })` | 递归创建目录，已存在不报错 |
| `readdir(path, { withFileTypes: true })` | 读取目录项，`Dirent` 可直接区分文件/目录/符号链接 |
| `stat` / `lstat` | 元数据；`lstat` 不跟随符号链接 |
| `rename` | 同分区原子替换，常用于临时文件提交 |
| `copyFile` / `cp` | 复制文件；`cp` 支持递归复制目录 |
| `rm(path, { recursive, force })` | 删除文件或目录；`force` 忽略不存在 |
| `access` | 检查存在/权限，通常直接用操作本身捕获错误更可靠 |
| `open` / `FileHandle` | 需要多次读写、定位、同步时使用 |
| `watch` | 文件变化监听，跨平台行为有差异，生产建议 chokidar |

## 常见用法

### 原子写 JSON

```ts
import { mkdir, rename, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { randomUUID } from 'node:crypto';

async function writeJsonAtomic(file: string, value: unknown) {
  await mkdir(dirname(file), { recursive: true });
  const temp = `${file}.${randomUUID()}.tmp`;
  await writeFile(temp, JSON.stringify(value, null, 2), 'utf8');
  await rename(temp, file); // 同目录 rename 才是原子的
}
```

### 递归遍历

```ts
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';

async function walk(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    if (entry.isSymbolicLink()) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else if (entry.isFile()) files.push(full);
  }
  return files;
}
```

### 常见错误

```ts
try {
  await readFile(path);
} catch (error) {
  if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
    // 文件不存在
  }
  throw error;
}
```

## 练习

| 练习 | 考点 | 提示 |
| --- | --- | --- |
| `01-json-store.ts` | `readFile`、`mkdir`、`rename`、错误链 | 临时文件失败也要清理 |
| `02-list-files.ts` | `readdir`、`Dirent`、递归 | 跳过符号链接；统一 `/` |
| `03-prune-old-files.ts` | `stat.mtimeMs`、`rm` | 只处理顶层普通文件 |
| `04-file-lock.ts` | 文件锁、stale 锁、超时 | `open(path, 'wx')` 原子创建；finally 释放 |
| `05-tail-file.ts` | 大日志尾部读取 | `FileHandle.read` 只读尾部，丢弃半行 |

04–05 面向企业级运维：定时任务需要跨进程互斥；日志诊断不能把整个文件读进内存。单机文件锁依赖本地文件系统语义，多节点请使用 Redis/数据库锁。

## 运行

```bash
pnpm --filter @node-tour/learn-node exec vitest run src/02-fs
pnpm --filter @node-tour/learn-node test:solutions:file src/02-fs
```
