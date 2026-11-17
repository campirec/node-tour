import { createHash } from 'node:crypto';
import { Readable } from 'node:stream';
import { describe, expect, it } from 'vitest';
import { loadImpl } from '../../shared/load-impl.js';

const impl = await loadImpl({
  exercise: () => import('./05-hash-stream.js'),
  solution: () => import('./solutions/05-hash-stream.js'),
});

const SHA256_HELLO =
  '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824';

describe('hashStream', () => {
  it('计算 SHA-256，与 chunk 切分方式无关', async () => {
    await expect(impl.hashStream(Readable.from(['hello']))).resolves.toBe(
      SHA256_HELLO,
    );
    await expect(
      impl.hashStream(Readable.from(['he', 'll', 'o'])),
    ).resolves.toBe(SHA256_HELLO);
  });

  it('支持其他算法', async () => {
    const digest = await impl.hashStream(Readable.from(['hello']), 'sha512');

    expect(digest).toHaveLength(128);
    expect(digest).toBe(
      createHash('sha512').update('hello').digest('hex'),
    );
  });

  it('空流返回空内容摘要', async () => {
    await expect(impl.hashStream(Readable.from([]))).resolves.toBe(
      createHash('sha256').digest('hex'),
    );
  });

  it('非法算法与上游错误都会拒绝', async () => {
    await expect(
      impl.hashStream(Readable.from(['x']), 'not-a-hash'),
    ).rejects.toThrow();

    const broken = new Readable({
      read() {
        this.destroy(new Error('source failed'));
      },
    });
    await expect(impl.hashStream(broken)).rejects.toThrowError('source failed');
  });
});
