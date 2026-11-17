# 10 · fetch

> 目标：用标准 fetch 完成超时、错误处理、重试与流式读取。

## 模块简介

Node 18+ 内置 `fetch`（基于 undici），无需安装 axios/node-fetch。它遵循 Web Fetch 标准：

- 网络失败（DNS、连接重置）会 reject；
- HTTP 4xx/5xx **不会** reject，需要检查 `response.ok` / `response.status`；
- 响应体是一次性流，`text()` / `json()` 只能消费一次；
- `AbortSignal` 用于超时与取消。

## 常用 API

| API | 作用 |
| --- | --- |
| `fetch(url, init)` | 发起请求 |
| `response.ok/status/statusText` | 判断结果 |
| `response.headers` | 响应头（`Headers` 对象） |
| `response.text/json/arrayBuffer` | 一次性消费响应体 |
| `response.body` | `ReadableStream`，用于流式读取 |
| `AbortSignal.timeout(ms)` | 超时信号 |
| `AbortController` | 手动取消 |
| `Request` / `Response` / `Headers` | Web 标准对象，可用于测试与中间件 |

## 常见用法

### 带超时的 GET

```ts
const response = await fetch(url, {
  signal: AbortSignal.timeout(5000),
  headers: { authorization: `Bearer ${token}` },
});
if (!response.ok) {
  throw new Error(`HTTP ${response.status}: ${await response.text()}`);
}
const data = await response.json();
```

### 流式读取

```ts
const response = await fetch(url);
const reader = response.body!.getReader();
const decoder = new TextDecoder();
for (;;) {
  const { done, value } = await reader.read();
  if (done) break;
  process.stdout.write(decoder.decode(value, { stream: true }));
}
reader.releaseLock();
```

### 重试原则

- 只重试幂等请求（GET、PUT、DELETE）或带幂等键的 POST；
- 只重试网络错误、408、425、429、5xx；
- 使用指数退避 + 抖动，尊重 `Retry-After`；
- 设置总预算，避免请求雪崩。

## 练习

| 练习 | 考点 | 提示 |
| --- | --- | --- |
| `01-fetch-json.ts` | 超时、ok 检查、JSON | 先 `text()` 再解析 |
| `02-fetch-with-retry.ts` | 重试策略、退避、AbortSignal | 最后一轮返回 Response |
| `03-stream-lines.ts` | `response.body.getReader()`、TextDecoder | 不要用 `response.text()` |
| `04-circuit-breaker.ts` | 熔断状态机、快速失败 | closed/open/half-open；注入 now |
| `05-paginate-api.ts` | 游标分页、防死循环 | 重复 cursor、maxPages 上限 |

04–05 面向企业级依赖治理：下游持续失败时应快速失败而不是继续重试；同步第三方数据必须限制页数并检测重复 cursor。

## 运行

```bash
pnpm --filter @node-tour/learn-node test:10-fetch
pnpm --filter @node-tour/learn-node test:solutions:10-fetch
```
