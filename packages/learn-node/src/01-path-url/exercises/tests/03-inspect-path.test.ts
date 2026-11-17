import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { loadImpl } from '../../../shared/load-impl.js';

const impl = await loadImpl({
  exercise: () => import('../03-inspect-path.js'),
  solution: () => import('../solutions/03-inspect-path.js'),
});

describe('inspectPath', () => {
  const cwd = resolve('fixtures', 'project');

  it('拆解相对路径并生成 POSIX 风格相对路径', () => {
    const info = impl.inspectPath('data/report.json.gz', cwd);

    expect(info).toEqual({
      dir: resolve(cwd, 'data'),
      name: 'report.json',
      ext: '.gz',
      isAbsolute: false,
      relativeToCwd: 'data/report.json.gz',
    });
  });

  it('绝对路径不会再次拼到 cwd 下', () => {
    const absolute = resolve(cwd, 'src', 'index.ts');
    const info = impl.inspectPath(absolute, cwd);

    expect(info.dir).toBe(resolve(cwd, 'src'));
    expect(info.name).toBe('index');
    expect(info.ext).toBe('.ts');
    expect(info.relativeToCwd).toBe('src/index.ts');
  });

  it('处理无扩展名、点文件与上级目录', () => {
    expect(impl.inspectPath('.env', cwd)).toMatchObject({
      name: '.env',
      ext: '',
      relativeToCwd: '.env',
    });
    expect(impl.inspectPath('../shared/util.ts', cwd)).toMatchObject({
      name: 'util',
      ext: '.ts',
      relativeToCwd: '../shared/util.ts',
    });
  });

  it('isAbsolute 反映输入形式，而不是解析后的结果', () => {
    expect(impl.inspectPath('a.txt', cwd).isAbsolute).toBe(false);
    expect(impl.inspectPath(resolve(cwd, 'a.txt'), cwd).isAbsolute).toBe(true);
  });
});
