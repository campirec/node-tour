import { describe, expect, it } from 'vitest';
import { loadImpl } from '../../shared/load-impl.js';

const impl = await loadImpl({
  exercise: () => import('./03-transfer-buffer.js'),
  solution: () => import('./solutions/03-transfer-buffer.js'),
});

describe('transferBuffer', () => {
  it('转移后原 buffer 被分离，内容保持一致', async () => {
    const original = new Uint8Array([1, 2, 3, 4, 5]).buffer;

    const result = await impl.transferBuffer(original);

    expect(result.originalByteLength).toBe(0);
    expect(result.receivedByteLength).toBe(5);
    expect(new Uint8Array(result.received)).toEqual(
      new Uint8Array([1, 2, 3, 4, 5]),
    );
  });
});
