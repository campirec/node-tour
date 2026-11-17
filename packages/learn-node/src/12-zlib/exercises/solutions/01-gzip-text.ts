import { gzip, gunzip } from 'node:zlib';
import { promisify } from 'node:util';

const gzipAsync = promisify(gzip);
const gunzipAsync = promisify(gunzip);

export async function gzipText(text: string): Promise<Buffer> {
  return gzipAsync(Buffer.from(text, 'utf8'));
}

export async function gunzipText(data: Buffer): Promise<string> {
  const decompressed = await gunzipAsync(data);
  return decompressed.toString('utf8');
}
