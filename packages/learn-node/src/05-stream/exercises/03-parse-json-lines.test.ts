import { Readable } from 'node:stream';
import { describe, expect, it } from 'vitest';
import { loadImpl } from '../../shared/load-impl.js';

const impl = await loadImpl({
  exercise: () => import('./03-parse-json-lines.js'),
  solution: () => import('./solutions/03-parse-json-lines.js'),
});

async function collect<T>(readable: Readable): Promise<T[]> {
  const values: T[] = [];
  for await (const value of impl.parseJsonLines<T>(readable)) {
    values.push(value);
  }
  return values;
}

describe('parseJsonLines', () => {
  it('跨 chunk 解析并跳过空行', async () => {
    const readable = Readable.from([
      '{"id":1,"name":"A"}\n\n{"id":2,',
      '"name":"B"}\r\n',
      '{"id":3,"name":"C"}',
    ]);

    await expect(collect(readable)).resolves.toEqual([
      { id: 1, name: 'A' },
      { id: 2, name: 'B' },
      { id: 3, name: 'C' },
    ]);
  });

  it('中文被拆到两个 chunk 时仍能解析', async () => {
    const data = Buffer.from('{"text":"你好世界"}\n', 'utf8');
    const readable = Readable.from([
      data.subarray(0, 15),
      data.subarray(15),
    ]);

    await expect(collect(readable)).resolves.toEqual([
      { text: '你好世界' },
    ]);
  });

  it('非法 JSON 错误包含行号', async () => {
    const readable = Readable.from([
      '{"ok":true}\n',
      'not-json\n',
      '{"after":true}\n',
    ]);

    await expect(collect(readable)).rejects.toThrowError('第 2 行');
  });
});
