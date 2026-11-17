import { createReadStream } from 'node:fs';
import { Readable } from 'node:stream';
import { createGzip } from 'node:zlib';
import { pipeline } from 'node:stream/promises';

/**
 * 企业级练习：流式上传 gzip 压缩文件到 HTTP 服务。
 *
 * 场景：日志归档上传、大文件备份、数据导出。不能先把整个文件读进内存。
 *
 * 要求：
 * - 使用 pipeline(createReadStream, createGzip, fetch body)；
 * - 请求头包含 content-encoding: gzip 与 content-type；
 * - 支持 AbortSignal；
 * - 返回 { status, uploadedBytes }（上传字节数 = 源文件大小）；
 * - 非 2xx 抛 HttpUploadError；
 * - 文件不存在时保留 ENOENT。
 */
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
  // TODO: pipeline(createReadStream, createGzip, fetch)
  throw new Error('TODO: uploadGzipStream');
}
