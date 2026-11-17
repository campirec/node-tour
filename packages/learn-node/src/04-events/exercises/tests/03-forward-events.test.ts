import { EventEmitter } from 'node:events';
import { describe, expect, it } from 'vitest';
import { loadImpl } from '../../../shared/load-impl.js';

const impl = await loadImpl({
  exercise: () => import('../03-forward-events.js'),
  solution: () => import('../solutions/03-forward-events.js'),
});

describe('forwardEvents', () => {
  it('转发参数，忽略未登记的事件', () => {
    const source = new EventEmitter();
    const target = new EventEmitter();
    const received: unknown[][] = [];
    target.on('data', (...args: unknown[]) => received.push(args));

    const dispose = impl.forwardEvents(source, target, ['data', 'data']);
    source.emit('data', 'a', 1);
    source.emit('other', 'ignored');
    source.emit('data', 'b');

    expect(received).toEqual([
      ['a', 1],
      ['b'],
    ]);
    expect(source.listenerCount('data')).toBe(1);
    dispose();
  });

  it('dispose 停止转发、清理监听器且可重复调用', () => {
    const source = new EventEmitter();
    const target = new EventEmitter();
    let count = 0;
    target.on('data', () => {
      count += 1;
    });

    const dispose = impl.forwardEvents(source, target, ['data']);
    source.emit('data', 1);
    dispose();
    dispose();
    source.emit('data', 2);

    expect(count).toBe(1);
    expect(source.listenerCount('data')).toBe(0);
  });
});
