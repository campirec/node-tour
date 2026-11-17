import { once } from 'node:events';
import { describe, expect, it } from 'vitest';
import { loadImpl } from '../../../shared/load-impl.js';

const impl = await loadImpl({
  exercise: () => import('../01-line-splitter.js'),
  solution: () => import('../solutions/01-line-splitter.js'),
});

async function split(chunks: (string | Buffer)[]): Promise<string[]> {
  const transform = impl.createLineSplitter();
  const lines: string[] = [];
  transform.on('data', (line: string) => lines.push(line));

  const ended = once(transform, 'end');
  for (const chunk of chunks) {
    transform.write(chunk);
  }
  transform.end();
  await ended;
  return lines;
}

describe('createLineSplitter', () => {
  it('处理多行、CRLF、空行与末尾无换行', async () => {
    await expect(
      split(['第一行\r\n第二行\n\n最后一行']),
    ).resolves.toEqual(['第一行', '第二行', '', '最后一行']);
  });

  it('跨 chunk 拆开的中文仍能正确解码', async () => {
    const data = Buffer.from('你好\n世界', 'utf8');

    await expect(
      split([data.subarray(0, 4), data.subarray(4)]),
    ).resolves.toEqual(['你好', '世界']);
  });

  it('空输入不产生任何行', async () => {
    await expect(split([])).resolves.toEqual([]);
  });
});
