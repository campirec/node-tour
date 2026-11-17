import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';
import { describe, expect, it } from 'vitest';
import { withTempDir } from '../../../shared/temp.js';
import { loadImpl } from '../../../shared/load-impl.js';

const impl = await loadImpl({
  exercise: () => import('../06-watch-dir.js'),
  solution: () => import('../solutions/06-watch-dir.js'),
});

describe('watchDir', () => {
  it('监听目录内文件变化并触发回调', async () => {
    await withTempDir(async (dir) => {
      const changes: Array<{ eventType: string; filename: string }> = [];
      const handle = impl.watchDir(dir);
      handle.onChange((change) => changes.push(change));

      await sleep(50);
      await writeFile(join(dir, 'a.txt'), 'hello');
      await sleep(150);

      expect(changes.length).toBeGreaterThan(0);
      expect(changes.some((c) => c.filename.includes('a.txt'))).toBe(true);

      await handle.dispose();
    });
  });

  it('dispose 后不再触发回调', async () => {
    await withTempDir(async (dir) => {
      let count = 0;
      const handle = impl.watchDir(dir);
      handle.onChange(() => { count += 1; });

      await handle.dispose();
      await handle.dispose(); // 幂等
      await writeFile(join(dir, 'b.txt'), 'x');
      await sleep(100);

      expect(count).toBe(0);
    });
  });

  it('支持注销单个监听器', async () => {
    await withTempDir(async (dir) => {
      const handle = impl.watchDir(dir);
      let count = 0;
      const off = handle.onChange(() => { count += 1; });

      off();
      await writeFile(join(dir, 'c.txt'), 'x');
      await sleep(100);

      expect(count).toBe(0);
      await handle.dispose();
    });
  });

  it('监听器抛错通过 onError 上报，不中断其他监听器', async () => {
    await withTempDir(async (dir) => {
      const errors: unknown[] = [];
      let received = 0;
      const handle = impl.watchDir(dir, {
        onError: (err) => errors.push(err),
      });

      handle.onChange(() => {
        throw new Error('listener failed');
      });
      handle.onChange(() => { received += 1; });

      await sleep(50);
      await writeFile(join(dir, 'd.txt'), 'x');
      await sleep(150);

      expect(errors.length).toBeGreaterThan(0);
      expect(received).toBeGreaterThan(0);

      await handle.dispose();
    });
  });
});
