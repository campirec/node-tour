import { describe, expect, it } from 'vitest';
import { loadImpl } from '../../../shared/load-impl.js';

const impl = await loadImpl({
  exercise: () => import('../01-parse-cli.js'),
  solution: () => import('../solutions/01-parse-cli.js'),
});

describe('parseCli', () => {
  it('提供默认值', () => {
    expect(impl.parseCli([])).toEqual({
      host: 'localhost',
      port: 3000,
      verbose: false,
      files: [],
    });
  });

  it('解析长选项、短选项与位置参数', () => {
    expect(
      impl.parseCli(['--host', '0.0.0.0', '--port', '8080', '-v', 'a.txt', 'b.txt']),
    ).toEqual({
      host: '0.0.0.0',
      port: 8080,
      verbose: true,
      files: ['a.txt', 'b.txt'],
    });
  });

  it('支持 --port=8080 与 -- 分隔符', () => {
    expect(impl.parseCli(['--port=8080', '--', '--not-a-flag'])).toEqual({
      host: 'localhost',
      port: 8080,
      verbose: false,
      files: ['--not-a-flag'],
    });
  });

  it('拒绝非法端口与未知选项', () => {
    expect(() => impl.parseCli(['--port', 'abc'])).toThrowError(RangeError);
    expect(() => impl.parseCli(['--port', '70000'])).toThrowError(RangeError);
    expect(() => impl.parseCli(['--unknown'])).toThrowError();
  });
});
