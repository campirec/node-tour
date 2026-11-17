import { Readable } from 'node:stream';
import { describe, expect, it } from 'vitest';
import { loadImpl } from '../../../shared/load-impl.js';

const impl = await loadImpl({
  exercise: () => import('../04-csv-stream.js'),
  solution: () => import('../solutions/04-csv-stream.js'),
});

async function collect(
  chunks: (string | Buffer)[],
  options?: { delimiter?: string; quote?: string; hasHeader?: boolean },
): Promise<Record<string, string>[]> {
  const rows: Record<string, string>[] = [];
  for await (const row of impl.parseCsvStream(Readable.from(chunks), options)) {
    rows.push(row);
  }
  return rows;
}

describe('parseCsvStream', () => {
  it('解析 BOM、CRLF 与普通字段', async () => {
    const csv = '﻿id,name\r\n1,张三\r\n2,李四\r\n';

    await expect(collect([csv])).resolves.toEqual([
      { id: '1', name: '张三' },
      { id: '2', name: '李四' },
    ]);
  });

  it('处理引号内的逗号、换行与转义引号', async () => {
    const csv = [
      'id,note',
      '1,"hello, world"',
      '2,"line1\nline2"',
      '3,"say ""hi"""',
    ].join('\n');

    await expect(collect([csv])).resolves.toEqual([
      { id: '1', note: 'hello, world' },
      { id: '2', note: 'line1\nline2' },
      { id: '3', note: 'say "hi"' },
    ]);
  });

  it('引号与中文被拆到多个 chunk 时仍能解析', async () => {
    const buffer = Buffer.from('id,note\n1,"你好, 世界"\n', 'utf8');
    const chunks: Buffer[] = [];
    for (let index = 0; index < buffer.length; index += 5) {
      chunks.push(buffer.subarray(index, index + 5));
    }

    await expect(collect(chunks)).resolves.toEqual([
      { id: '1', note: '你好, 世界' },
    ]);
  });

  it('支持无表头与自定义分隔符', async () => {
    await expect(
      collect(['1;Alice\n2;Bob\n'], {
        delimiter: ';',
        hasHeader: false,
      }),
    ).resolves.toEqual([
      { column_1: '1', column_2: 'Alice' },
      { column_1: '2', column_2: 'Bob' },
    ]);
  });

  it('拒绝列数不一致与重复表头', async () => {
    await expect(collect(['a,b\n1\n'])).rejects.toMatchObject({
      name: 'CsvParseError',
      row: 2,
    });
    await expect(collect(['a,a\n1,2\n'])).rejects.toThrowError(
      /表头重复/,
    );
  });

  it('拒绝未闭合的引号', async () => {
    await expect(collect(['a,b\n1,"unclosed'])).rejects.toMatchObject({
      name: 'CsvParseError',
    });
  });

  it('跳过空行', async () => {
    await expect(collect(['a,b\n1,2\n\n3,4\n'])).resolves.toEqual([
      { a: '1', b: '2' },
      { a: '3', b: '4' },
    ]);
  });
});
