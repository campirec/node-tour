import { Readable, Writable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { createGzip, gunzip } from 'node:zlib';
import { promisify } from 'node:util';

const gunzipAsync = promisify(gunzip);

export async function gzipJsonLines(
  records: readonly unknown[],
): Promise<Buffer> {
  const lines = records.map((record, index) => {
    let encoded: string | undefined;
    try {
      encoded = JSON.stringify(record);
    } catch (error) {
      throw new TypeError(`第 ${index + 1} 条记录无法序列化`, { cause: error });
    }
    if (encoded === undefined) {
      throw new TypeError(`第 ${index + 1} 条记录无法序列化`);
    }
    return `${encoded}\n`;
  });

  const chunks: Buffer[] = [];
  const sink = new Writable({
    write(chunk: Buffer, _encoding, callback): void {
      chunks.push(Buffer.from(chunk));
      callback();
    },
  });

  await pipeline(Readable.from(lines), createGzip(), sink);
  return Buffer.concat(chunks);
}

export async function gunzipJsonLines<T = unknown>(
  data: Buffer,
): Promise<T[]> {
  const text = (await gunzipAsync(data)).toString('utf8');
  const records: T[] = [];
  let lineNumber = 0;

  for (const line of text.split(/\r?\n/)) {
    lineNumber += 1;
    if (line.trim() === '') {
      continue;
    }
    try {
      records.push(JSON.parse(line) as T);
    } catch (error) {
      throw new Error(`第 ${lineNumber} 行不是合法 JSON`, { cause: error });
    }
  }

  return records;
}
