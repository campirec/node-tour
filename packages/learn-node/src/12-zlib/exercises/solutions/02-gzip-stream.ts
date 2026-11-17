import { Writable, type Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { createGzip } from 'node:zlib';

export async function gzipStream(readable: Readable): Promise<Buffer> {
  const chunks: Buffer[] = [];

  const collector = new Writable({
    write(chunk: Buffer, _encoding, callback): void {
      chunks.push(Buffer.from(chunk));
      callback();
    },
  });

  await pipeline(readable, createGzip(), collector);
  return Buffer.concat(chunks);
}
