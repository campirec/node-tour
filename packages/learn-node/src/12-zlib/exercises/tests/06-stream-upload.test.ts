import { once } from 'node:events';
import { createServer, type Server } from 'node:http';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { gunzip } from 'node:zlib';
import { promisify } from 'node:util';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { withTempDir } from '../../../shared/temp.js';
import { loadImpl } from '../../../shared/load-impl.js';

const impl = await loadImpl({
  exercise: () => import('../06-stream-upload.js'),
  solution: () => import('../solutions/06-stream-upload.js'),
});

const gunzipAsync = promisify(gunzip);

describe('uploadGzipStream', () => {
  let server: Server;
  let baseUrl: string;
  let receivedBody: Buffer = Buffer.alloc(0);
  let receivedHeaders: Record<string, string | string[] | undefined> = {};

  beforeAll(async () => {
    server = createServer((req, res) => {
      const chunks: Buffer[] = [];
      req.on('data', (chunk: Buffer) => chunks.push(chunk));
      req.on('end', () => {
        receivedBody = Buffer.concat(chunks);
        receivedHeaders = req.headers;
        res.writeHead(200, { 'content-type': 'application/json' });
        res.end(JSON.stringify({ received: receivedBody.length }));
      });
    });

    server.listen(0, '127.0.0.1');
    await once(server, 'listening');
    const address = server.address();
    if (!address || typeof address === 'string') {
      throw new Error('服务器启动失败');
    }
    baseUrl = `http://127.0.0.1:${address.port}`;
  });

  afterAll(async () => {
    const closed = once(server, 'close');
    server.close();
    server.closeAllConnections();
    await closed;
  });

  it('流式上传 gzip 文件，服务端可解压', async () => {
    await withTempDir(async (dir) => {
      const source = join(dir, 'data.log');
      const text = 'upload test\n'.repeat(1000);
      await writeFile(source, text, 'utf8');

      const result = await impl.uploadGzipStream(source, `${baseUrl}/upload`, {
        contentType: 'text/plain',
      });

      expect(result.status).toBe(200);
      expect(result.uploadedBytes).toBe(Buffer.byteLength(text));
      expect(receivedHeaders['content-encoding']).toBe('gzip');
      expect(receivedHeaders['content-type']).toBe('text/plain');

      const decompressed = await gunzipAsync(receivedBody);
      expect(decompressed.toString('utf8')).toBe(text);
    });
  });

  it('文件不存在时保留 ENOENT', async () => {
    await expect(
      impl.uploadGzipStream('/nonexistent/file.txt', `${baseUrl}/upload`),
    ).rejects.toMatchObject({ code: 'ENOENT' });
  });
});
