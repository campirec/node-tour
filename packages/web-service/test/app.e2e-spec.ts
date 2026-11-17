import 'reflect-metadata';
import { Test } from '@nestjs/testing';
import { NodeAdapter, type NestNodeApplication } from '@nestjs/platform-node';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { AppModule } from '../src/app.module.js';
import { configureApp } from '../src/app.setup.js';
import { loadEnv } from '../src/config/env.js';
import { TaskStatus, type Task } from '../src/modules/tasks/tasks.types.js';

interface ErrorBody {
  statusCode: number;
  error: string;
  message: string | string[];
  path: string;
  requestId: string | null;
  timestamp: string;
}

describe('HTTP API (e2e)', () => {
  let app: NestNodeApplication;
  let taskId: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication<NestNodeApplication>(
      new NodeAdapter(),
    );
    configureApp(app, loadEnv({}));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/health 返回健康状态', async () => {
    const response = await app.inject({ method: 'GET', url: '/api/health' });

    expect(response.statusCode).toBe(200);
    expect(response.headers['x-request-id']).toBeTypeOf('string');
    expect(response.json()).toMatchObject({ status: 'ok' });
  });

  it('POST /api/tasks 创建任务', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/tasks',
      payload: {
        title: '写一个 NestJS 服务',
        description: '包含校验、错误处理与测试',
      },
    });
    const body = response.json<Task>();

    expect(response.statusCode).toBe(201);
    expect(body.title).toBe('写一个 NestJS 服务');
    expect(body.status).toBe(TaskStatus.Todo);
    taskId = body.id;
  });

  it('POST /api/tasks 拒绝非法请求体', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/tasks',
      payload: { title: '', unknownField: true },
      headers: { 'x-request-id': 'e2e-invalid-body' },
    });
    const body = response.json<ErrorBody>();

    expect(response.statusCode).toBe(400);
    expect(body.statusCode).toBe(400);
    expect(Array.isArray(body.message)).toBe(true);
    expect(body.requestId).toBe('e2e-invalid-body');
    expect(response.headers['x-request-id']).toBe('e2e-invalid-body');
  });

  it('GET /api/tasks 支持按状态筛选', async () => {
    await app.inject({
      method: 'POST',
      url: '/api/tasks',
      payload: { title: '已完成任务', status: TaskStatus.Done },
    });

    const response = await app.inject({
      method: 'GET',
      url: '/api/tasks?status=done',
    });
    const body = response.json<Task[]>();

    expect(response.statusCode).toBe(200);
    expect(body).toHaveLength(1);
    expect(body[0]?.title).toBe('已完成任务');
  });

  it('GET /api/tasks/:id 返回单个任务', async () => {
    const response = await app.inject({
      method: 'GET',
      url: `/api/tasks/${taskId}`,
    });

    expect(response.statusCode).toBe(200);
    expect(response.json<Task>().id).toBe(taskId);
  });

  it('PATCH /api/tasks/:id 部分更新', async () => {
    const response = await app.inject({
      method: 'PATCH',
      url: `/api/tasks/${taskId}`,
      payload: { status: TaskStatus.InProgress },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json<Task>().status).toBe(TaskStatus.InProgress);
  });

  it('不存在的任务返回统一的 404 结构', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/tasks/00000000-0000-4000-8000-000000000000',
    });
    const body = response.json<ErrorBody>();

    expect(response.statusCode).toBe(404);
    expect(body).toMatchObject({
      statusCode: 404,
      path: '/api/tasks/00000000-0000-4000-8000-000000000000',
    });
    expect(body.message).toContain('不存在');
  });

  it('DELETE /api/tasks/:id 返回 204', async () => {
    const response = await app.inject({
      method: 'DELETE',
      url: `/api/tasks/${taskId}`,
    });

    expect(response.statusCode).toBe(204);
    expect(response.body).toBe('');
  });
});
