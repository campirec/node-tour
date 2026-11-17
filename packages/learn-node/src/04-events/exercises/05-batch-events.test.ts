import { EventEmitter } from 'node:events';
import { setTimeout as sleep } from 'node:timers/promises';
import { describe, expect, it } from 'vitest';
import { loadImpl } from '../../shared/load-impl.js';

const impl = await loadImpl({
  exercise: () => import('./05-batch-events.js'),
  solution: () => import('./solutions/05-batch-events.js'),
});

describe('batchEvents', () => {
  it('达到批量大小时立即 flush', async () => {
    const emitter = new EventEmitter();
    const batches: number[][] = [];
    const batcher = impl.batchEvents<number>(emitter, 'audit', {
      maxBatchSize: 2,
      maxDelayMs: 100,
      onBatch: (items) => {
        batches.push(items);
      },
    });

    emitter.emit('audit', 1);
    emitter.emit('audit', 2);
    emitter.emit('audit', 3);
    await batcher.flush();
    await batcher.dispose();

    expect(batches).toEqual([[1, 2], [3]]);
  });

  it('达到最大延迟时自动 flush', async () => {
    const emitter = new EventEmitter();
    const batches: string[][] = [];
    const batcher = impl.batchEvents<string>(emitter, 'log', {
      maxBatchSize: 100,
      maxDelayMs: 10,
      onBatch: (items) => {
        batches.push(items);
      },
    });

    emitter.emit('log', 'a');
    emitter.emit('log', 'b');
    await sleep(30);

    expect(batches).toEqual([['a', 'b']]);
    await batcher.dispose();
  });

  it('onBatch 抛错时调用 onError 并继续工作', async () => {
    const emitter = new EventEmitter();
    const errors: string[] = [];
    const batches: number[][] = [];
    let shouldFail = true;
    const batcher = impl.batchEvents<number>(emitter, 'metric', {
      maxBatchSize: 1,
      maxDelayMs: 100,
      onBatch: (items) => {
        if (shouldFail) {
          shouldFail = false;
          throw new Error('sink unavailable');
        }
        batches.push(items);
      },
      onError: (error) => {
        errors.push((error as Error).message);
      },
    });

    emitter.emit('metric', 1);
    await batcher.flush();
    emitter.emit('metric', 2);
    await batcher.flush();
    await batcher.dispose();

    expect(errors).toEqual(['sink unavailable']);
    expect(batches).toEqual([[2]]);
  });

  it('dispose 处理剩余事件并移除监听器', async () => {
    const emitter = new EventEmitter();
    const batches: number[][] = [];
    const batcher = impl.batchEvents<number>(emitter, 'event', {
      maxBatchSize: 10,
      maxDelayMs: 100,
      onBatch: (items) => {
        batches.push(items);
      },
    });

    emitter.emit('event', 42);
    await batcher.dispose();

    expect(batches).toEqual([[42]]);
    expect(emitter.listenerCount('event')).toBe(0);
  });

  it('拒绝非法参数', () => {
    const emitter = new EventEmitter();
    const base = {
      onBatch: () => undefined,
    };

    expect(() =>
      impl.batchEvents(emitter, 'event', {
        ...base,
        maxBatchSize: 0,
        maxDelayMs: 10,
      }),
    ).toThrowError(RangeError);
    expect(() =>
      impl.batchEvents(emitter, 'event', {
        ...base,
        maxBatchSize: 1,
        maxDelayMs: -1,
      }),
    ).toThrowError(RangeError);
  });
});
