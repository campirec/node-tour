import { createHash } from 'node:crypto';
import { Writable, type Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';

export async function hashStream(
  readable: Readable,
  algorithm = 'sha256',
): Promise<string> {
  const hash = createHash(algorithm);

  const sink = new Writable({
    write(chunk: Buffer, _encoding, callback): void {
      hash.update(chunk);
      callback();
    },
  });

  await pipeline(readable, sink);
  return hash.digest('hex');
}
