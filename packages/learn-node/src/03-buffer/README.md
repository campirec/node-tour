# 03 · Buffer

> 目标：理解 Node 的二进制数据模型，掌握编码、切片、读写整数与零拷贝视图。

## 模块简介

`Buffer` 是 `Uint8Array` 的子类，用来处理文件、网络、加密等二进制数据。

关键区别：

| 操作 | 是否复制 |
| --- | --- |
| `Buffer.from(string)` | 复制（分配新内存） |
| `Buffer.from(arrayBuffer)` | 共享底层内存 |
| `buffer.subarray(start, end)` | 共享内存，返回视图 |
| `buffer.slice(...)` | 与 `subarray` 类似（历史 API） |
| `Buffer.concat([...])` | 复制到新 Buffer |

共享内存意味着修改视图会影响原 Buffer，排查线上问题时要特别小心。

## 常用 API

| API | 作用 |
| --- | --- |
| `Buffer.from` / `alloc` / `allocUnsafe` | 创建 Buffer；`allocUnsafe` 可能含旧内存，必须自行填满 |
| `Buffer.concat(list, totalLength?)` | 合并多个 Buffer |
| `buf.subarray(start, end)` | 零拷贝切片 |
| `buf.toString('utf8' \| 'hex' \| 'base64' \| 'base64url')` | 编码转换 |
| `buf.writeUInt32BE` / `readUInt32BE` | 读写大端整数，网络协议常用 |
| `buf.indexOf(value)` | 查找字节或子 Buffer |
| `Buffer.byteLength(string, encoding)` | 字符串的字节长度 |
| `buf.equals(other)` / `Buffer.compare(a, b)` | 内容比较 |
| `buf.copy(target, targetStart, sourceStart, sourceEnd)` | 复制到目标 Buffer |

## 常见用法

### 编码转换

```ts
const text = '你好';
const utf8 = Buffer.from(text, 'utf8');       // 6 字节
const base64 = utf8.toString('base64');       // 5L2g5aW9
const hex = utf8.toString('hex');             // e4bda0e5a5bd
const restored = Buffer.from(base64, 'base64').toString('utf8');
```

### 长度前缀协议

```ts
function encode(text: string): Buffer {
  const payload = Buffer.from(text, 'utf8');
  const header = Buffer.alloc(4);
  header.writeUInt32BE(payload.length, 0);
  return Buffer.concat([header, payload]);
}
```

### 处理 TCP 粘包

网络一次 `data` 事件不保证对应一条消息。需要累积 Buffer，按长度前缀循环切分：

```ts
function takeMessages(buffer: Buffer): { messages: string[]; rest: Buffer } {
  const messages: string[] = [];
  let offset = 0;
  while (buffer.length - offset >= 4) {
    const length = buffer.readUInt32BE(offset);
    if (buffer.length - offset - 4 < length) break;
    messages.push(buffer.subarray(offset + 4, offset + 4 + length).toString('utf8'));
    offset += 4 + length;
  }
  return { messages, rest: buffer.subarray(offset) };
}
```

## 练习

| 练习 | 考点 | 提示 |
| --- | --- | --- |
| `01-length-prefixed-codec.ts` | `writeUInt32BE`、`concat`、`subarray` | 长度按 UTF-8 字节数 |
| `02-base64url.ts` | `base64url` 编码 | 解码前先校验字符集 |
| `03-split-buffer.ts` | `indexOf`、零拷贝切片 | 注意空片段与空分隔符 |
| `04-jwt-decode.ts` | JWT 结构、base64url、claims | 只解码不验签；exp 用秒 |
| `05-cursor-codec.ts` | 不透明分页游标 | base64url(JSON)，带版本 v1 |

04–05 面向企业级鉴权与分页：JWT 解码只能用于展示/调试，认证必须验签；游标要版本化并校验字段，避免客户端伪造结构导致下游崩溃。

## 运行

```bash
pnpm --filter @node-tour/learn-node exec vitest run src/03-buffer
pnpm --filter @node-tour/learn-node test:solutions:file src/03-buffer
```
