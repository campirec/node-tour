import { createReadStream } from 'node:fs';
import { Readable } from 'node:stream';
import { createGzip } from 'node:zlib';
import { pipeline } from 'node:stream/promises';

/**
 * 企业级练习：流式上传 gzip 压缩文件到 HTTP 服务
 *
 * 场景：日志归档上传、大文件备份、数据导出。不能先把整个文件读进内存，
 * 需要 pipeline 把文件流经 gzip 后直接作为请求体发送。
 *
 * 函数签名
 *   uploadGzipStream(filePath: string, url: string, options?: UploadGzipOptions): Promise<UploadGzipResult>
 *   - filePath：源文件路径
 *   - url：目标 HTTP 地址
 *   - options.contentType：请求 Content-Type，默认 'application/octet-stream'
 *   - options.signal：AbortSignal，用于中止上传
 *   - 返回：{ status, uploadedBytes }，uploadedBytes 为源文件字节数
 *
 * 示例
 *   uploadGzipStream('/tmp/data.log', 'http://127.0.0.1:3000/upload',
 *                    { contentType: 'text/plain' })
 *   => { status: 200, uploadedBytes: 12000 }
 *   服务端收到的请求头 content-encoding: gzip、content-type: text/plain，
 *   请求体可被 gunzip 还原为原文件内容。
 *
 *   uploadGzipStream('/nonexistent/file.txt', url)
 *   => 拒绝并抛含 code: 'ENOENT' 的错误
 *
 * 要求
 *   1. 使用 pipeline 串联 createReadStream → createGzip，gzip 输出作为 fetch 请求体；
 *   2. 请求头包含 content-encoding: gzip 与 content-type（取 options.contentType 或默认值）；
 *   3. 支持 AbortSignal 中止上传；
 *   4. 返回结果包含 HTTP status 与 uploadedBytes（等于源文件 stat.size）；
 *   5. 服务端返回非 2xx 状态码时抛 HttpUploadError（含 status 字段）；
 *   6. 源文件不存在时保留 ENOENT 错误码。
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
