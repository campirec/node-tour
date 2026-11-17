# 09 · http

> 目标：理解 HTTP 服务器与客户端的底层生命周期，为使用 Fastify/Nest 打好基础。

## 模块简介

`node:http` 提供 HTTP/1.1 服务器与客户端，不包含路由、body 解析、参数校验。

一个请求的生命周期：

1. `createServer` 注册回调；
2. 请求头到达，`request` 是可读流；
3. 逐块读取 body（注意大小上限）；
4. 写状态码、响应头、响应体；
5. 连接可能被 keep-alive 复用。

常见问题：

- 忘记消费请求体，连接无法复用；
- 直接 `JSON.parse(await readAll(req))`，被超大请求打爆内存；
- 同步 CPU 任务阻塞事件循环；
- `server.close()` 不会立刻断开已有 keep-alive 连接。

## 常用 API

| API | 作用 |
| --- | --- |
| `http.createServer(handler)` | 创建服务器 |
| `server.listen({ port, host })` | 监听端口；0 表示随机端口 |
| `server.close(cb)` | 停止接收新连接，等待已有连接结束 |
| `server.closeAllConnections()` | 强制断开所有连接（Node 18.2+） |
| `request.method/url/headers` | 请求行与请求头 |
| `for await (const chunk of request)` | 流式读取请求体 |
| `response.writeHead(status, headers)` | 写状态码与响应头 |
| `response.write/end` | 写响应体 |
| `http.request(url, options, cb)` | 客户端请求 |
| `request.setTimeout(ms, cb)` | 套接字空闲超时 |

## 常见用法

### 最小服务器

```ts
import { createServer } from 'node:http';

const server = createServer((request, response) => {
  if (request.method === 'GET' && request.url === '/health') {
    response.writeHead(200, { 'content-type': 'application/json' });
    response.end(JSON.stringify({ ok: true }));
    return;
  }
  response.writeHead(404).end();
});

server.listen(3000, '127.0.0.1');
```

### 限制请求体

```ts
const chunks: Buffer[] = [];
let size = 0;
for await (const chunk of request) {
  size += chunk.length;
  if (size > 1_048_576) {
    response.writeHead(413).end();
    request.destroy();
    return;
  }
  chunks.push(chunk);
}
```

### 优雅关闭

```ts
process.once('SIGTERM', () => {
  server.close(() => process.exit(0));
  // 可选：超时后 server.closeAllConnections()
});
```

## 练习

| 练习 | 考点 | 提示 |
| --- | --- | --- |
| `01-read-json-body.ts` | 请求体流、大小限制、JSON 错误 | 先看 content-length |
| `02-json-server.ts` | 服务器、路由、响应、错误处理 | 不要泄漏 500 内部信息 |
| `03-request-json.ts` | `http.request`、超时、响应解析 | 非 2xx 不抛错 |
| `04-middleware-chain.ts` | 洋葱模型、短路、错误中间件 | next 只能调用一次 |
| `05-rate-limiter.ts` | 固定窗口限流、key 维度、内存上限 | 注入 now；429 + Retry-After |

04–05 面向企业级请求治理：鉴权/日志/限流/错误处理都应做成可组合中间件；限流要按 IP、userId 或 apiKey 分桶，并限制内存中的 key 数量。

## 运行

```bash
pnpm --filter @node-tour/learn-node test:09-http
pnpm --filter @node-tour/learn-node test:solutions:09-http
```
