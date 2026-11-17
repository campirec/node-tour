import { describe, expect, it } from 'vitest';
import { loadImpl } from '../../shared/load-impl.js';

const impl = await loadImpl({
  exercise: () => import('./04-parse-json-in-worker.js'),
  solution: () => import('./solutions/04-parse-json-in-worker.js'),
});

describe('parseJsonInWorker', () => {
  it('解析较大的 JSON 并返回结构化对象', async () => {
    const value = {
      items: Array.from({ length: 20_000 }, (_, index) => ({
        id: index,
        name: `item-${index}`,
        active: index % 2 === 0,
      })),
    };

    const parsed = await impl.parseJsonInWorker<typeof value>(
      JSON.stringify(value),
    );

    expect(parsed.items).toHaveLength(20_000);
    expect(parsed.items[19_999]).toEqual({
      id: 19_999,
      name: 'item-19999',
      active: false,
    });
  });

  it('非法 JSON 以普通 Error 拒绝', async () => {
    await expect(impl.parseJsonInWorker('{broken')).rejects.toThrowError(
      /JSON|Unexpected|position/i,
    );
  });

  it('拒绝非法参数', async () => {
    await expect(
      impl.parseJsonInWorker(123 as unknown as string),
    ).rejects.toBeInstanceOf(TypeError);
    await expect(
      impl.parseJsonInWorker('{}', 0),
    ).rejects.toBeInstanceOf(RangeError);
  });
});
