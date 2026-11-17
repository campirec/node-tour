import { resolve, sep } from 'node:path';
import { describe, expect, it } from 'vitest';
import { loadImpl } from '../../../shared/load-impl.js';

const impl = await loadImpl({
  exercise: () => import('../04-safe-resolve.js'),
  solution: () => import('../solutions/04-safe-resolve.js'),
});

describe('resolveWithinRoot', () => {
  const root = resolve('fixtures', 'storage');

  it('允许根目录内的相对路径与绝对路径', () => {
    expect(impl.resolveWithinRoot(root, 'uploads/avatar.png')).toBe(
      resolve(root, 'uploads/avatar.png'),
    );
    expect(impl.resolveWithinRoot(root, 'a/../b.txt')).toBe(
      resolve(root, 'b.txt'),
    );
    expect(impl.resolveWithinRoot(root, resolve(root, 'inside.txt'))).toBe(
      resolve(root, 'inside.txt'),
    );
  });

  it('拒绝目录穿越与外部绝对路径', () => {
    expect(() => impl.resolveWithinRoot(root, '../secret.txt')).toThrowError(
      impl.PathEscapeError,
    );
    expect(() =>
      impl.resolveWithinRoot(root, resolve('fixtures', 'outside.txt')),
    ).toThrowError(impl.PathEscapeError);
    expect(() => impl.resolveWithinRoot(root, 'a/../../secret')).toThrowError(
      impl.PathEscapeError,
    );
  });

  it('拒绝空路径与 NUL 字节', () => {
    expect(() => impl.resolveWithinRoot(root, '')).toThrowError(
      impl.PathEscapeError,
    );
    expect(() =>
      impl.resolveWithinRoot(root, 'safe\0.txt'),
    ).toThrowError(impl.PathEscapeError);
  });

  it('允许根目录本身', () => {
    expect(impl.resolveWithinRoot(root, '.')).toBe(root);
  });

  it('根路径的末尾分隔符不会影响判断', () => {
    expect(() =>
      impl.resolveWithinRoot(`${root}${sep}`, '../outside'),
    ).toThrowError(impl.PathEscapeError);
  });
});
