# 11 · crypto

> 目标：掌握哈希、密码存储、对称加密、HMAC 与安全随机数，避免常见密码学误用。

## 模块简介

`node:crypto` 是 OpenSSL 的封装。原则：

- 不要自己设计加密算法；
- 不要用 `Math.random()` 生成 token；
- 不要把 SHA-256 当密码哈希；
- 不要复用 AES-GCM 的 IV；
- 比较密钥/签名用 `timingSafeEqual`；
- 密钥放环境变量/KMS，不要提交到仓库。

## 常用 API

| API | 作用 |
| --- | --- |
| `randomBytes(n)` | 密码学安全随机字节 |
| `randomUUID()` | UUID v4 |
| `createHash('sha256')` | 普通摘要（完整性、缓存 key） |
| `createHmac('sha256', key)` | 带密钥的消息认证 |
| `scrypt` / `pbkdf2` | 密码慢哈希（优先 argon2，Node 内置 scrypt） |
| `createCipheriv` / `createDecipheriv` | 对称加密（推荐 aes-256-gcm） |
| `timingSafeEqual(a, b)` | 常量时间比较，长度必须相同 |
| `generateKeyPair` / `sign` / `verify` | 非对称签名 |
| `webcrypto` | Web Crypto 标准 API |

## 常见用法

### 安全随机 token

```ts
import { randomBytes } from 'node:crypto';

const token = randomBytes(32).toString('base64url'); // 256 bit
```

### 密码哈希

```ts
import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scryptAsync = promisify(scrypt);
const salt = randomBytes(16);
const hash = await scryptAsync(password, salt, 64);
```

生产建议使用 `argon2` 包，参数按 OWASP 建议配置。

### AES-256-GCM

```ts
const iv = randomBytes(12);
const cipher = createCipheriv('aes-256-gcm', key, iv);
const ciphertext = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
const tag = cipher.getAuthTag();
```

解密时必须 `setAuthTag(tag)`，并且 `final()` 失败说明数据被篡改。

### Webhook 签名

```ts
const signature = createHmac('sha256', secret).update(rawBody).digest('hex');
const valid = timingSafeEqual(
  Buffer.from(signature),
  Buffer.from(received),
);
```

签名必须基于**原始字节**（raw body），不要先 JSON.parse 再 stringify。

## 练习

| 练习 | 考点 | 提示 |
| --- | --- | --- |
| `01-password-hash.ts` | scrypt、盐、timingSafeEqual | 存储格式包含算法标识 |
| `02-aes-gcm.ts` | AES-GCM、IV、authTag | IV 12 字节，密钥 32 字节 |
| `03-hmac-signature.ts` | HMAC、常量时间比较 | 长度不同先返回 false |
| `04-signed-url.ts` | 过期签名 URL、防篡改 | 签 method+path+expires；timingSafeEqual |
| `05-api-key.ts` | API Key 生成/存储/校验 | 只存 SHA-256；展示 prefix |

04–05 面向企业级访问控制：私有文件下载用短时签名 URL；开放平台 API Key 明文只返回一次，数据库只保存 hash，并用 prefix 便于后台识别。

## 运行

```bash
pnpm --filter @node-tour/learn-node test:11-crypto
pnpm --filter @node-tour/learn-node test:solutions:11-crypto
```
