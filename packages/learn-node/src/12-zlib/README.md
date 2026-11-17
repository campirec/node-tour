# 12 · zlib 压缩

> 目标：掌握 gzip/brotli 的 Buffer 与流式用法，并为 HTTP 做内容协商。

## 模块简介

`node:zlib` 支持：

- `gzip` / `gunzip`：HTTP 最常见的压缩格式；
- `deflate` / `inflate`：zlib 容器格式；
- `brotliCompress` / `brotliDecompress`：比 gzip 更高压缩率，现代浏览器都支持；
- 流式版本：`createGzip`、`createBrotliCompress`。

不要压缩已经压缩过的数据（图片、视频、zip），收益低还浪费 CPU。压缩是 CPU 与带宽的权衡：静态资源构建时压缩，动态响应按大小阈值决定。

## 常用 API

| API | 作用 |
| --- | --- |
| `gzip(buffer, cb)` / `gzipSync` | 一次性压缩 |
| `gunzip` | 解压 |
| `brotliCompress` / `brotliDecompress` | Brotli |
| `createGzip(options)` | 流式压缩 Transform |
| `createGunzip()` | 流式解压 Transform |
| `zlib.constants` | 压缩级别等常量 |
| `zlib.crc32` | 计算 CRC32（Node 22.2+） |

## 常见用法

### HTTP 压缩

```ts
import { createGzip } from 'node:zlib';
import { pipeline } from 'node:stream/promises';

response.writeHead(200, {
  'content-type': 'application/json',
  'content-encoding': 'gzip',
});
await pipeline(JSON.stringify(data), createGzip(), response);
```

客户端请求头：

```
Accept-Encoding: gzip, br
```

响应头：

```
Content-Encoding: br
Vary: Accept-Encoding
```

`Vary` 很重要，否则 CDN/代理可能把压缩内容发给不支持它的客户端。

### 协商 q 值

`Accept-Encoding: gzip;q=1, br;q=0.5` 表示 gzip 优先级更高。`q=0` 表示拒绝该编码。

## 练习

| 练习 | 考点 | 提示 |
| --- | --- | --- |
| `01-gzip-text.ts` | `gzip`/`gunzip` promisify | 检查 0x1f 0x8b 魔数 |
| `02-gzip-stream.ts` | `createGzip` + pipeline | Writable 收集 chunk |
| `03-content-encoding.ts` | Accept-Encoding 协商 | q 值 + 优先级 |
| `04-gzip-file.ts` | 原子压缩文件、临时文件清理 | pipeline + rename |
| `05-jsonl-gzip.ts` | JSON Lines 导入/导出 | 逐行解析；错误带行号 |

04–05 面向企业级归档与数据交换：日志压缩必须原子落盘，避免半成品；审计/事件导出常使用 `.jsonl.gz`，需要可逆、可诊断。

## 运行

```bash
pnpm --filter @node-tour/learn-node test:12-zlib
pnpm --filter @node-tour/learn-node test:solutions:12-zlib
```
