import type { Readable } from 'node:stream';
import { StringDecoder } from 'node:string_decoder';

export async function* parseJsonLines<T = unknown>(
  readable: Readable,
): AsyncGenerator<T> {
  const decoder = new StringDecoder('utf8');
  let buffer = '';
  let lineNumber = 0;

  for await (const chunk of readable) {
    buffer += decoder.write(
      Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk as Uint8Array),
    );

    let index = buffer.indexOf('\n');
    while (index !== -1) {
      const line = buffer.slice(0, index).replace(/\r$/, '');
      buffer = buffer.slice(index + 1);
      lineNumber += 1;
      if (line.trim() !== '') {
        yield parseLine<T>(line, lineNumber);
      }
      index = buffer.indexOf('\n');
    }
  }

  buffer += decoder.end();
  if (buffer.trim() !== '') {
    lineNumber += 1;
    yield parseLine<T>(buffer, lineNumber);
  }
}

function parseLine<T>(line: string, lineNumber: number): T {
  try {
    return JSON.parse(line) as T;
  } catch (error) {
    throw new Error(`第 ${lineNumber} 行不是合法 JSON`, { cause: error });
  }
}
