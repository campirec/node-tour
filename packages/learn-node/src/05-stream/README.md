# 05 · stream

> 目标：用流处理大数据与背压，理解 `pipeline`、`Transform` 与异步迭代。

## 模块简介

流把数据切成小块处理，内存占用与数据总量无关。四种基本类型：

- `Readable`：文件、HTTP 请求体、`process.stdin`
- `Writable`：文件、HTTP 响应、`process.stdout`
- `Duplex`：同时可读可写，如 TCP socket
- `Transform`：读写之间的转换，如 gzip、行切分

两种模式：

- 字节模式（默认）：chunk 是 `Buffer` / `Uint8Array`
- 对象模式（`objectMode`）：chunk 可以是任意 JS 值

背压（backpressure）是流的核心：消费者处理不过来时，`write()` 返回 `false`，生产者应等待 `drain`。`pipeline` 会自动处理这些细节并在任一端出错时销毁整条链。

## 常用 API

| API | 作用 |
| --- | --- |
| `Readable.from(iterable)` | 从数组/生成器/异步生成器创建可读流 |
| `stream.pipeline(source, ...transforms, dest)` | 串联并传播错误、清理资源 |
| `stream/promises.pipeline` | Promise 版 pipeline |
| `Transform` | 实现 `transform(chunk, enc, cb)` 与 `flush(cb)` |
| `stream/consumers.text/json/buffer` | 一次性消费小响应 |
| `finished(stream)` | 等待流结束或失败 |
| `Readable.toWeb` / `fromWeb` | Node 流与 Web Streams 互转 |
| `StringDecoder` | 跨 chunk 解码 UTF-8，避免半个字符 |
| `readable.setEncoding('utf8')` | 让 chunk 变成字符串（内部仍处理边界） |

## 常见用法

### pipeline 处理文件

```ts
import { createReadStream, createWriteStream } from 'node:fs';
import { createGzip } from 'node:zlib';
import { pipeline } from 'node:stream/promises';

await pipeline(
  createReadStream('access.log'),
  createGzip(),
  createWriteStream('access.log.gz'),
);
```

### 异步迭代消费

```ts
for await (const chunk of readable) {
  process(chunk);
}
```

### 行处理

不要假设一个 chunk 就是一行。参考练习 1，使用 `StringDecoder` + 残留 buffer，或者使用 `readline.createInterface({ input: readable })`。

### 常见错误

- 使用 `.pipe()` 但不监听目标流错误，导致泄漏；优先 `pipeline`。
- 在 `data` 事件里做 CPU 密集任务，阻塞背压。
- 忘记处理 `error`，进程崩溃或 Promise 永远不结束。
- 把大文件 `readFile` 成字符串再处理，失去流的全部优势。

## 练习

| 练习 | 考点 | 提示 |
| --- | --- | --- |
| `01-line-splitter.ts` | `Transform`、`StringDecoder`、flush | `readableObjectMode: true` |
| `02-count-bytes.ts` | `Writable`、`pipeline` | 统计 `chunk.byteLength` |
| `03-parse-json-lines.ts` | 异步生成器、增量解析 | 行号从 1 开始 |
| `04-csv-stream.ts` | CSV 状态机、引号/换行、BOM | 引号可跨 chunk；严格列数校验 |
| `05-hash-stream.ts` | `createHash` + `pipeline` | 流式计算，不落内存 |

04–05 面向企业级数据导入与完整性校验：CSV 是运营/财务系统最常见的交换格式；上传与构建产物需要流式 SHA-256，避免大文件占满内存。

## 运行

```bash
pnpm --filter @node-tour/learn-node test:05-stream
pnpm --filter @node-tour/learn-node test:solutions:05-stream
```
