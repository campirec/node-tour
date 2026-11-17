import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { Readable } from 'node:stream';
import { createGzip } from 'node:zlib';
import { pipeline } from 'node:stream/promises';

export class HttpUploadError extends Error {
  readonly status: number;

  constructor(status: number, body: string) {
    super(`上传失败 HTTP ${status}: ${body.slice(0, 200)}`);
    this.name = 'HttpUploadError';
    this.status = status;
  }
}

export interface UploadGzipOptions {
  contentType?: string;
  signal?: AbortSignal;
}

export interface UploadGzipResult {
  status: number;
  uploadedBytes: number;
}

export async function uploadGzipStream(
  filePath: string,
  url: string,
  options: UploadGzipOptions = {},
): Promise<UploadGzipResult> {
  const info = await stat(filePath);
  if (!info.isFile()) {
    throw new Error('目标不是普通文件');
  }

  const source = createReadStream(filePath);
  const gzip = createGzip();

  // 用 Promise 包装 fetch，pipeline 负责把 gzip 输出写入请求体
  const upload = async (): Promise<Response> => {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'content-encoding': 'gzip',
        'content-type': options.contentType ?? 'application/octet-stream',
      },
      body: Readable.toWeb(gzip) as ReadableStream,
      duplex: 'half',
      signal: options.signal,
    } as RequestInit);

    if (!response.ok) {
      const text = await response.text();
      throw new HttpUploadError(response.status, text);
    }
    return response;
  };

  // 先启动 fetch，再把文件流 pipeline 到 gzip
  const fetchPromise = upload();
  await pipeline(source, gzip);
  const response = await fetchPromise;

  return {
    status: response.status,
    uploadedBytes: info.size,
  };
}
