import { Transform, type TransformCallback } from 'node:stream';
import { StringDecoder } from 'node:string_decoder';

export function createLineSplitter(): Transform {
  const decoder = new StringDecoder('utf8');
  let buffer = '';

  return new Transform({
    readableObjectMode: true,

    transform(
      chunk: Buffer | string,
      _encoding: BufferEncoding,
      callback: TransformCallback,
    ): void {
      buffer += decoder.write(
        Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk),
      );

      let index = buffer.indexOf('\n');
      while (index !== -1) {
        const line = buffer.slice(0, index).replace(/\r$/, '');
        buffer = buffer.slice(index + 1);
        this.push(line);
        index = buffer.indexOf('\n');
      }

      callback();
    },

    flush(callback: TransformCallback): void {
      buffer += decoder.end();
      if (buffer.length > 0) {
        this.push(buffer.replace(/\r$/, ''));
      }
      callback();
    },
  });
}
