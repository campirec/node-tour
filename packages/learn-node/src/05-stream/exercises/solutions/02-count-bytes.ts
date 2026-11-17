import { Writable, type Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';

export async function countBytes(readable: Readable): Promise<number> {
  let total = 0;

  const counter = new Writable({
    write(chunk: Buffer, _encoding, callback): void {
      total += chunk.byteLength;
      callback();
    },
  });

  await pipeline(readable, counter);
  return total;
}
