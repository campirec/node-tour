import { randomUUID } from 'node:crypto';
import type { NestNodeApplication } from '@nestjs/platform-node';
import type { NodeRequest, NodeResponse } from '@nestjs/platform-node/adapters/node-request.js';
import { parseCorsOrigins, type Env } from './config/env.js';

export const REQUEST_ID_HEADER = 'x-request-id';

type RequestWithId = NodeRequest & { id: string };
type NextFunction = (error?: unknown) => void;

/**
 * 在控制器与拦截器之前建立请求 ID。
 * Fastify 会自动生成 ID，原生 NodeAdapter 不会，因此由应用自己负责。
 * 只接受长度受限且不含控制字符的外部 ID，否则生成 UUID。
 */
export function requestIdMiddleware(
  request: NodeRequest,
  response: NodeResponse,
  next: NextFunction,
): void {
  const incoming = request.headers[REQUEST_ID_HEADER];
  const value = Array.isArray(incoming) ? incoming[0] : incoming;
  const id = value && /^[\x21-\x7e]{1,128}$/.test(value)
    ? value
    : randomUUID();

  (request as RequestWithId).id = id;
  response.setHeader(REQUEST_ID_HEADER, id);
  next();
}

/** main.ts 与 e2e 测试共用同一套装配，避免环境行为不一致。 */
export function configureApp(app: NestNodeApplication, env: Env): void {
  app.setGlobalPrefix('api');
  app.use(requestIdMiddleware);
  app.useBodyParser('json', { limit: 1024 * 1024 });
  app.enableCors({
    origin: parseCorsOrigins(env.CORS_ORIGINS),
    credentials: true,
  });
}
