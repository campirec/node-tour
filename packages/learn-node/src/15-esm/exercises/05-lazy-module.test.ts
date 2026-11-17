import { describe, expect, it } from 'vitest';
import { loadImpl } from '../../shared/load-impl.js';

const impl = await loadImpl({
  exercise: () => import('./05-lazy-module.js'),
  solution: () => import('./solutions/05-lazy-module.js'),
});

describe('createLazyModule', () => {
  it('并发调用只执行一次 loader 并共享结果', async () => {
    let calls = 0;
    let release!: (value: string) => void;
    const loader = impl.createLazyModule(
      () =>
        new Promise<string>((resolve) => {
          calls += 1;
          release = resolve;
        }),
    );

    const first = loader();
    const second = loader();
    expect(calls).toBe(1);
    expect(first).toBe(second);

    release('ready');
    await expect(Promise.all([first, second])).resolves.toEqual([
      'ready',
      'ready',
    ]);
    expect(calls).toBe(1);
  });

  it('失败后清空缓存，允许重试', async () => {
    let calls = 0;
    const loader = impl.createLazyModule(async () => {
      calls += 1;
      if (calls === 1) {
        throw new Error('init failed');
      }
      return 'ok';
    });

    await expect(loader()).rejects.toThrowError('init failed');
    await expect(loader()).resolves.toBe('ok');
    expect(calls).toBe(2);
  });

  it('reset 后重新加载', async () => {
    let calls = 0;
    const loader = impl.createLazyModule(async () => {
      calls += 1;
      return calls;
    });

    await expect(loader()).resolves.toBe(1);
    await expect(loader()).resolves.toBe(1);
    loader.reset();
    await expect(loader()).resolves.toBe(2);
  });

  it('拒绝非函数 loader', () => {
    expect(() =>
      impl.createLazyModule(null as unknown as () => Promise<never>),
    ).toThrowError(TypeError);
  });
});
