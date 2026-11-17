import { Readable } from 'node:stream';
import { gunzip } from 'node:zlib';
import { promisify } from 'node:util';
import { describe, expect, it } from 'vitest';
import { loadImpl } from '../../../shared/load-impl.js';

const impl = await loadImpl({
  exercise: () => import('../02-gzip-stream.js'),
  solution: () => import('../solutions/02-gzip-stream.js'),
});

const gunzipAsync = promisify(gunzip);

describe('gzipStream', () => {
  it('流式压缩大文本并可还原', async () => {
    const text = 'stream data '.repeat(5000);
    const compressed = await impl.gzipStream(
      Readable.from([text.slice(0, 1000), text.slice(1000)]),
    );

    expect(compressed.byteLength).toBeLessThan(Buffer.byteLength(text));
    const restored = await gunzipAsync(compressed);
    expect(restored.toString('utf8')).toBe(text);
  });

  it('空流也产生合法 gzip', async () => {
    const compressed = await impl.gzipStream(Readable.from([]));

    const restored = await gunzipAsync(compressed);
    expect(restored.toString('utf8')).toBe('');
  });

  it('上游错误会传播', async () => {
    const broken = new Readable({
      read() {
        this.destroy(new Error('source failed'));
      },
    });

    await expect(impl.gzipStream(broken)).rejects.toThrowError('source failed');
  });
});
