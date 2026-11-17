import 'reflect-metadata';
import type { LogLevel } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NodeAdapter, type NestNodeApplication } from '@nestjs/platform-node';
import { AppModule } from './app.module.js';
import { configureApp } from './app.setup.js';
import { loadEnv, type Env } from './config/env.js';
import { setupSwagger } from './swagger.js';

function toNestLogLevels(level: Env['LOG_LEVEL']): LogLevel[] {
  const order: Record<Env['LOG_LEVEL'], number> = {
    fatal: 0,
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
    trace: 4,
  };
  const levels: LogLevel[] = ['error', 'warn', 'log', 'debug', 'verbose'];
  return levels.slice(0, order[level] + 1);
}

async function bootstrap(): Promise<void> {
  const env = loadEnv();

  const app = await NestFactory.create<NestNodeApplication>(
    AppModule,
    new NodeAdapter({ trustProxy: true }),
    { logger: toNestLogLevels(env.LOG_LEVEL) },
  );

  configureApp(app, env);
  setupSwagger(app);
  app.enableShutdownHooks();

  await app.listen(env.PORT, env.HOST);
}

bootstrap().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
