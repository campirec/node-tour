import { readFile } from 'node:fs';
import { promisify } from 'node:util';

const readFileAsync = promisify(readFile) as (
  path: string,
  encoding: BufferEncoding,
) => Promise<string>;

export async function readUtf8(filePath: string): Promise<string> {
  return readFileAsync(filePath, 'utf8');
}
