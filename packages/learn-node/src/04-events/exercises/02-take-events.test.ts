import { EventEmitter } from 'node:events';
import { describe, expect, it } from 'vitest';
import { loadImpl } from '../../shared/load-impl.js';

const impl = await loadImpl({
  exercise: () => import('./02-take-events.js'),
  solution: () => import('./solutions/02-take-events.js'),
});

describe('takeEvents', () => {
  it('只收集前 N 个事件并移除监听器', async () => {
    const emitter = new EventEmitter();
    const promise = impl.takeEvents<number>(emitter, 'tick', 3);

    setImmediate(() => {
      emitter.emit('tick', 1);
      emitter.emit('tick', 2);
      emitter.emit('tick', 3);
      emitter.emit('tick', 4);
    });

    await expect(promise).resolves.toEqual([1, 2, 3]);
    expect(emitter.listenerCount('tick')).toBe(0);
  });

  it('中止时拒绝并清理监听器', async () => {
    const emitter = new EventEmitter();
    const controller = new AbortController();
    const promise = impl.takeEvents(emitter, 'tick', 1, controller.signal);

    controller.abort();

    await expect(promise).rejects.toMatchObject({ name: 'AbortError' });
    expect(emitter.listenerCount('tick')).toBe(0);
  });

  it('拒绝非法 count', async () => {
    const emitter = new EventEmitter();

    await expect(impl.takeEvents(emitter, 'tick', 0)).rejects.toBeInstanceOf(
      RangeError,
    );
    await expect(
      impl.takeEvents(emitter, 'tick', 1.5),
    ).rejects.toBeInstanceOf(RangeError);
  });
});
