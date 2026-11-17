import { EventEmitter } from 'node:events';
import { describe, expect, it } from 'vitest';
import { loadImpl } from '../../shared/load-impl.js';

const impl = await loadImpl({
  exercise: () => import('./01-wait-for-event.js'),
  solution: () => import('./solutions/01-wait-for-event.js'),
});

describe('waitForEvent', () => {
  it('返回事件的全部参数并清理监听器', async () => {
    const emitter = new EventEmitter();
    const promise = impl.waitForEvent(emitter, 'ready', 200);
    setTimeout(() => emitter.emit('ready', 'ok', 42), 5);

    await expect(promise).resolves.toEqual(['ok', 42]);
    expect(emitter.listenerCount('ready')).toBe(0);
  });

  it('超时后拒绝并清理监听器', async () => {
    const emitter = new EventEmitter();

    await expect(
      impl.waitForEvent(emitter, 'never', 10),
    ).rejects.toThrowError('等待事件 never 超时（10ms）');
    expect(emitter.listenerCount('never')).toBe(0);
  });

  it('等待期间触发 error 会直接拒绝', async () => {
    const emitter = new EventEmitter();
    // 练习未实现时也保证 error 有监听器，避免默认模式产生 unhandled error。
    emitter.on('error', () => undefined);
    const promise = impl.waitForEvent(emitter, 'ready', 200);
    setTimeout(() => emitter.emit('error', new Error('连接失败')), 5);

    await expect(promise).rejects.toThrowError('连接失败');
    expect(emitter.listenerCount('ready')).toBe(0);
  });
});
