# 16 · net 与 dns

> 目标：理解 TCP 套接字与域名解析，知道 HTTP 之下发生了什么。

## 模块简介

`node:net` 提供 TCP/Unix socket。HTTP、数据库驱动、Redis 客户端都建立在它之上。

`node:dns` 提供域名解析：

- `lookup`：使用操作系统解析器（hosts + DNS），返回单个地址，最接近实际连接行为；
- `resolve4` / `resolve6`：直接查询 DNS，返回所有地址；
- `resolveMx` / `resolveTxt`：查询其他记录类型。

## 常用 API

| API | 作用 |
| --- | --- |
| `net.createServer(handler)` | 创建 TCP 服务器 |
| `net.createConnection({ host, port })` | 创建客户端连接 |
| `socket.write/end/destroy` | 写数据 / 半关闭 / 强制销毁 |
| `socket.pipe(socket)` | echo 或代理 |
| `socket.setTimeout(ms)` | 空闲超时 |
| `socket.setNoDelay(true)` | 关闭 Nagle，降低小包延迟 |
| `net.isIP(host)` | 0 / 4 / 6 |
| `dns.lookup(host)` | 系统解析器 |
| `dns.resolve4/resolve6` | DNS 查询 |
| `dns.setDefaultResultOrder('ipv4first')` | 调整地址顺序 |

## 常见用法

### TCP 客户端

```ts
import { createConnection } from 'node:net';
import { once } from 'node:events';

const socket = createConnection({ host: '127.0.0.1', port: 6379 });
socket.setEncoding('utf8');
socket.write('PING\r\n');
const [reply] = await once(socket, 'data');
console.log(reply);
socket.end();
```

### 处理粘包

TCP 是字节流。一次 `data` 可能包含半条消息或多条消息：

```ts
let buffer = Buffer.alloc(0);
socket.on('data', (chunk) => {
  buffer = Buffer.concat([buffer, chunk]);
  // 按长度前缀或分隔符循环切分
});
```

### DNS 查询

```ts
import { lookup } from 'node:dns/promises';

const { address, family } = await lookup('example.com');
```

容器/Serverless 环境里 DNS 可能受限；生产代码要设置超时与重试。

## 练习

| 练习 | 考点 | 提示 |
| --- | --- | --- |
| `01-echo-server.ts` | `net.createServer`、socket 生命周期 | 记录并销毁 socket |
| `02-classify-host.ts` | `net.isIP` | trim 后判断 |
| `03-lookup-host.ts` | `dns/promises.lookup` | family 只有 4/6 |
| `04-free-port.ts` | 空闲端口、占用检测 | listen(0)；注意返回后仍可能被抢占 |
| `05-wait-for-port.ts` | 启动依赖就绪、TCP 探测 | 单次连接受剩余超时约束 |

04–05 面向企业级启动与测试：并行测试使用动态端口避免冲突；服务启动时等待数据库/Redis 端口就绪，比固定 sleep 更可靠（但关键依赖仍需健康检查）。

## 运行

```bash
pnpm --filter @node-tour/learn-node test:16-net-dns
pnpm --filter @node-tour/learn-node test:solutions:16-net-dns
```
