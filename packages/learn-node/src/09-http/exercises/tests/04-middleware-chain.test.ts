import { describe, expect, it } from 'vitest';
import { loadImpl } from '../../../shared/load-impl.js';

const impl = await loadImpl({
  exercise: () => import('../04-middleware-chain.js'),
  solution: () => import('../solutions/04-middleware-chain.js'),
});

function context(): {
  method: string;
  url: URL;
  status: number;
  body?: unknown;
  state: Record<string, unknown>;
} {
  return {
    method: 'GET',
    url: new URL('https://api.test/tasks?status=todo'),
    status: 404,
    state: {},
  };
}

describe('composeMiddleware', () => {
  it('按注册顺序执行并形成洋葱模型', async () => {
    const events: string[] = [];
    const run = impl.composeMiddleware([
      async (_ctx, next) => {
        events.push('auth:before');
        await next();
        events.push('auth:after');
      },
      async (_ctx, next) => {
        events.push('log:before');
        await next();
        events.push('log:after');
      },
      async (ctx) => {
        events.push('handler');
        ctx.status = 200;
        ctx.body = { ok: true };
      },
    ]);

    const result = await run(context());

    expect(events).toEqual([
      'auth:before',
      'log:before',
      'handler',
      'log:after',
      'auth:after',
    ]);
    expect(result.status).toBe(200);
    expect(result.body).toEqual({ ok: true });
  });

  it('不调用 next 时短路后续中间件', async () => {
    const events: string[] = [];
    const run = impl.composeMiddleware([
      (ctx) => {
        ctx.status = 401;
        ctx.body = { error: 'unauthorized' };
      },
      () => {
        events.push('should-not-run');
      },
    ]);

    const result = await run(context());

    expect(result.status).toBe(401);
    expect(events).toEqual([]);
  });

  it('通过 state 传递请求级数据', async () => {
    const run = impl.composeMiddleware([
      (ctx, next) => {
        ctx.state.userId = 'user-1';
        return next();
      },
      async (ctx) => {
        ctx.status = 200;
        ctx.body = { userId: ctx.state.userId };
      },
    ]);

    const result = await run(context());
    expect(result.body).toEqual({ userId: 'user-1' });
  });

  it('重复调用 next 抛出错误', async () => {
    const run = impl.composeMiddleware([
      async (_ctx, next) => {
        await next();
        await next();
      },
    ]);

    await expect(run(context())).rejects.toThrowError('next()');
  });

  it('异常向上传播，由最外层错误中间件处理', async () => {
    const run = impl.composeMiddleware([
      async (ctx, next) => {
        try {
          await next();
        } catch (error) {
          ctx.status = 500;
          ctx.body = { error: (error as Error).message };
        }
      },
      () => {
        throw new Error('handler failed');
      },
    ]);

    const result = await run(context());
    expect(result).toMatchObject({
      status: 500,
      body: { error: 'handler failed' },
    });
  });
});
