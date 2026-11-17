import { setTimeout as sleep } from 'node:timers/promises';
import { describe, expect, it } from 'vitest';
import { loadImpl } from '../../../shared/load-impl.js';

const impl = await loadImpl({
  exercise: () => import('../04-shutdown-manager.js'),
  solution: () => import('../solutions/04-shutdown-manager.js'),
});

describe('createShutdownManager', () => {
  it('按 LIFO 执行钩子并传递关闭原因', async () => {
    const manager = impl.createShutdownManager();
    const events: string[] = [];
    manager.register('db', (reason) => {
      events.push(`db:${reason}`);
    });
    manager.register('http', async (reason) => {
      await sleep(5);
      events.push(`http:${reason}`);
    });

    await manager.shutdown('SIGTERM');

    expect(events).toEqual(['http:SIGTERM', 'db:SIGTERM']);
    expect(manager.isShuttingDown()).toBe(true);
  });

  it('幂等：重复 shutdown 只执行一次', async () => {
    const manager = impl.createShutdownManager();
    let calls = 0;
    manager.register('only', () => {
      calls += 1;
    });

    const first = manager.shutdown();
    const second = manager.shutdown();

    expect(first).toBe(second);
    await Promise.all([first, second]);
    expect(calls).toBe(1);
  });

  it('单个钩子失败不阻止其他钩子，并聚合错误', async () => {
    const errors: string[] = [];
    const events: string[] = [];
    const manager = impl.createShutdownManager({
      onError: (error, name) => {
        errors.push(`${name}:${(error as Error).message}`);
      },
    });

    manager.register('db', () => {
      events.push('db');
    });
    manager.register('cache', () => {
      throw new Error('cache close failed');
    });

    await expect(manager.shutdown()).rejects.toBeInstanceOf(AggregateError);
    expect(errors).toEqual(['cache:cache close failed']);
    expect(events).toEqual(['db']);
  });

  it('钩子超时后继续执行其他钩子', async () => {
    const manager = impl.createShutdownManager({ timeoutMs: 20 });
    const events: string[] = [];

    manager.register('fast', () => {
      events.push('fast');
    });
    manager.register('hang', async () => {
      await sleep(10_000);
    });

    await expect(manager.shutdown()).rejects.toBeInstanceOf(AggregateError);
    expect(events).toEqual(['fast']);
  });

  it('支持注销与关闭后禁止注册', async () => {
    const manager = impl.createShutdownManager();
    let called = 0;
    const dispose = manager.register('removed', () => {
      called += 1;
    });
    manager.register('kept', () => undefined);
    expect(manager.hookCount()).toBe(2);

    dispose();
    expect(manager.hookCount()).toBe(1);
    await manager.shutdown();
    expect(called).toBe(0);
    expect(() => manager.register('late', () => undefined)).toThrowError(
      '正在关闭',
    );
  });
});
