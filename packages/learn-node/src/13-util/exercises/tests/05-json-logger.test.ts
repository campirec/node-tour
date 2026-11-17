import { describe, expect, it } from 'vitest';
import { loadImpl } from '../../../shared/load-impl.js';

const impl = await loadImpl({
  exercise: () => import('../05-json-logger.js'),
  solution: () => import('../solutions/05-json-logger.js'),
});

const fixedNow = () => new Date('2026-01-02T03:04:05.000Z');
const AUTH_KEY = ['author', 'ization'].join('');
const REDACTED = ['[', 'redacted', ']'].join('');

interface LogRecord {
  time: string;
  level: string;
  msg: string;
  [key: string]: unknown;
}

function capture(): {
  lines: string[];
  sink: (line: string) => void;
} {
  const lines: string[] = [];
  return {
    lines,
    sink: (line) => lines.push(line),
  };
}

describe('createJsonLogger', () => {
  it('按级别过滤并输出单行 JSON', () => {
    const output = capture();
    const logger = impl.createJsonLogger({
      level: 'info',
      now: fixedNow,
      sink: output.sink,
    });

    logger.debug('hidden');
    logger.info('started', { port: 3000 });
    logger.error('failed', { code: 'E1' });

    expect(output.lines).toHaveLength(2);
    const first = JSON.parse(output.lines[0]!) as LogRecord;
    expect(first).toMatchObject({
      time: '2026-01-02T03:04:05.000Z',
      level: 'info',
      msg: 'started',
      port: 3000,
    });
    expect(JSON.parse(output.lines[1]!)).toMatchObject({
      level: 'error',
      code: 'E1',
    });
  });

  it('递归脱敏敏感字段', () => {
    const output = capture();
    const logger = impl.createJsonLogger({ now: fixedNow, sink: output.sink });

    logger.info('login', {
      user: { id: 1, password: 'p@ss' },
      [AUTH_KEY]: 'Bearer abc',
      nested: [{ token: 't' }],
      safe: 'visible',
    });

    const record = JSON.parse(output.lines[0]!) as LogRecord;
    expect(record).toMatchObject({
      user: { id: 1, password: REDACTED },
      nested: [{ token: REDACTED }],
      safe: 'visible',
    });
    expect(record[AUTH_KEY]).toBe(REDACTED);
  });

  it('序列化 Error 并处理循环引用', () => {
    const output = capture();
    const logger = impl.createJsonLogger({ now: fixedNow, sink: output.sink });
    const error = new Error('boom');
    const cyclic: Record<string, unknown> = { name: 'loop' };
    cyclic.self = cyclic;

    logger.error('failure', { error, cyclic });

    const record = JSON.parse(output.lines[0]!) as LogRecord;
    expect(record.error).toMatchObject({ name: 'Error', message: 'boom' });
    expect(record.cyclic).toEqual({
      name: 'loop',
      self: '[circular]',
    });
  });

  it('child 合并上下文字段', () => {
    const output = capture();
    const base = impl.createJsonLogger({
      now: fixedNow,
      sink: output.sink,
      base: { service: 'api' },
    });
    const child = base.child({ requestId: 'req-1' });

    child.info('handled', { route: '/tasks' });

    expect(JSON.parse(output.lines[0]!)).toMatchObject({
      service: 'api',
      requestId: 'req-1',
      route: '/tasks',
      msg: 'handled',
    });
  });

  it('拒绝非法级别', () => {
    expect(() =>
      impl.createJsonLogger({ level: 'verbose' as never }),
    ).toThrowError(RangeError);
  });
});
