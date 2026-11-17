# web-service · NestJS 12 + 原生 Node.js 企业级后端

> 一个可以直接运行、测试、构建的 NestJS ESM 服务骨架：配置校验、全局校验管道、统一错误、请求日志、Swagger、优雅关闭、内存 CRUD 示例与 e2e 测试。

## 技术栈

- Node.js `>=22.12`，ESM
- TypeScript 6（`NodeNext` 模块解析）
- NestJS 12（原生 ESM）+ `@nestjs/platform-node`
- 直接基于 `node:http`，不经过 Express 或 Fastify
- Zod 校验环境变量
- class-validator / class-transformer 校验 DTO
- Swagger（`/docs`）
- Vitest + `unplugin-swc`（保留 `emitDecoratorMetadata`）

## 快速开始

```bash
# 在仓库根目录
pnpm install

# 可选：准备环境变量
cd packages/web-service
cp env.example .env        # PowerShell: Copy-Item env.example .env

# 开发（Nest CLI watch）
pnpm dev:web

# 或
pnpm --filter @node-tour/web-service dev
```

默认地址：`http://127.0.0.1:3000`  
Swagger：`http://127.0.0.1:3000/docs`

构建与生产启动：

```bash
pnpm --filter @node-tour/web-service build
pnpm --filter @node-tour/web-service start
```

## 环境变量

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `NODE_ENV` | `development` | `development` / `test` / `production` |
| `PORT` | `3000` | 监听端口 |
| `HOST` | `0.0.0.0` | 监听地址 |
| `LOG_LEVEL` | `info` | Nest 日志级别 |
| `CORS_ORIGINS` | `http://localhost:5173` | 逗号分隔的允许来源 |

配置在启动时由 Zod 校验；非法值会直接阻止启动，而不是运行到一半才报错。

## API

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| `GET` | `/api/health` | 存活探针 |
| `GET` | `/api/tasks?status=todo` | 任务列表，可按状态筛选 |
| `POST` | `/api/tasks` | 创建任务 |
| `GET` | `/api/tasks/:id` | 查询单个任务 |
| `PATCH` | `/api/tasks/:id` | 部分更新 |
| `DELETE` | `/api/tasks/:id` | 删除，返回 204 |

```bash
curl http://127.0.0.1:3000/api/health

curl -X POST http://127.0.0.1:3000/api/tasks \
  -H 'content-type: application/json' \
  -d '{"title":"完成 Stream 练习","description":"实现 line splitter"}'

curl 'http://127.0.0.1:3000/api/tasks?status=todo'
```

统一错误结构：

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": ["title must be longer than or equal to 1 characters"],
  "path": "/api/tasks",
  "requestId": "req-1",
  "timestamp": "2026-01-01T00:00:00.000Z"
}
```

5xx 不会把内部异常细节返回给客户端，完整堆栈只写日志。

## 目录结构

```
src/
  main.ts                     # 启动、日志级别、Swagger、优雅关闭
  app.module.ts               # ConfigModule + 全局 Pipe/Filter/Interceptor
  app.setup.ts                # 全局前缀、request ID、JSON body 限制、CORS
  config/env.ts               # Zod 环境变量 schema
  common/
    filters/all-exceptions.filter.ts
    interceptors/request-logging.interceptor.ts
  modules/
    health/                   # 健康检查
    tasks/                    # DTO + Service + Controller
test/
  app.e2e-spec.ts             # NodeAdapter inject e2e
```

## 关键设计

1. **配置 fail-fast**：`ConfigModule.forRoot({ validate })` 使用同一份 `envSchema`。
2. **DTO 白名单**：`whitelist + forbidNonWhitelisted`，未知字段直接 400。
3. **统一异常出口**：`AllExceptionsFilter` 映射 `HttpException` 与未知异常，附带 `requestId`。
4. **请求追踪**：请求级中间件生成或透传 `x-request-id`，错误体与请求日志共用同一 ID。
5. **请求体保护**：原生 Node JSON parser 限制为 1 MiB，超限返回 413。
6. **测试复用装配逻辑**：`configureApp` 避免 e2e 与 main 不一致。
7. **内存仓储**：`TasksService` 用 `Map` 演示分层；替换为 Prisma/TypeORM 时 controller 与测试基本不变。
8. **优雅关闭**：`enableShutdownHooks()`，部署时配合 SIGTERM。

## 原生 NodeAdapter 说明

启动入口使用：

```ts
const app = await NestFactory.create<NestNodeApplication>(
  AppModule,
  new NodeAdapter({ trustProxy: true }),
);
await app.listen(env.PORT, env.HOST);
```

它直接处理 Node.js 的 `http.Server`，路由由 Nest 的 radix tree 实现，并在原生 `IncomingMessage` / `ServerResponse` 上提供少量 Express 风格辅助方法。当前代码只使用通用中间件、`request.headers`、响应头与 Nest 内置能力。

与 Express/Fastify 不完全兼容的地方包括：路由大小写敏感、字符串响应默认 `text/plain`、默认不生成 ETag，以及不支持 `res.render()`、`res.download()`、`res.jsonp()` 等部分 Express 专有 API。Fastify 自动生成的 request ID 不属于 Node HTTP 能力，本项目在 `app.setup.ts` 显式补齐。

官方资料：[NestJS HTTP adapters](https://docs.nestjs.com/http/performance)。

## 测试

```bash
pnpm --filter @node-tour/web-service test
pnpm --filter @node-tour/web-service typecheck
```

- 单元测试：`env.spec.ts`、`tasks.service.spec.ts`
- e2e：`test/app.e2e-spec.ts`，使用 `app.inject()`，不需要真实端口
- Vitest 通过 `unplugin-swc` 启用 `legacyDecorator` 与 `decoratorMetadata`，保证 Nest 构造器注入正常

## 下一步可以加什么

- 数据库与迁移（Prisma / Drizzle / TypeORM）
- 认证授权（JWT、RBAC、Guard）
- 限流、幂等键、请求体大小限制
- 结构化日志（pino）、OpenTelemetry、Prometheus
- Dockerfile、健康检查、CI
- API 版本化与分页
