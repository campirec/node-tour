import { brotliDecompress, gunzip } from 'node:zlib';
import { promisify } from 'node:util';
import { describe, expect, it } from 'vitest';
import { loadImpl } from '../../shared/load-impl.js';

const impl = await loadImpl({
  exercise: () => import('./03-content-encoding.js'),
  solution: () => import('./solutions/03-content-encoding.js'),
});

const brotliAsync = promisify(brotliDecompress);
const gunzipAsync = promisify(gunzip);

const text = 'Content-Encoding negotiation '.repeat(50);

describe('compressForEncoding', () => {
  it('同时支持 br 与 gzip 时优先 br', async () => {
    const result = await impl.compressForEncoding(text, 'gzip, br');

    expect(result.encoding).toBe('br');
    expect((await brotliAsync(result.body)).toString('utf8')).toBe(text);
  });

  it('按 q 值选择', async () => {
    const result = await impl.compressForEncoding(
      text,
      'gzip;q=1, br;q=0.5',
    );

    expect(result.encoding).toBe('gzip');
    expect((await gunzipAsync(result.body)).toString('utf8')).toBe(text);
  });

  it('q=0 表示不可接受', async () => {
    const result = await impl.compressForEncoding(text, 'br;q=0');

    expect(result.encoding).toBe('identity');
    expect(result.body.toString('utf8')).toBe(text);
  });

  it('缺省与 identity 返回原文', async () => {
    for (const header of ['', 'identity']) {
      const result = await impl.compressForEncoding(text, header);
      expect(result.encoding).toBe('identity');
      expect(result.body.toString('utf8')).toBe(text);
    }
  });

  it('通配符 * 选择 br', async () => {
    const result = await impl.compressForEncoding(text, '*');

    expect(result.encoding).toBe('br');
  });
});
