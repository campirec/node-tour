import {
  request as httpRequest,
  type IncomingHttpHeaders,
} from 'node:http';

export interface JsonClientResult<T> {
  status: number;
  headers: IncomingHttpHeaders;
  body: T;
}

export interface RequestJsonOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  timeoutMs?: number;
}

export function requestJson<T = unknown>(
  url: string,
  options: RequestJsonOptions = {},
): Promise<JsonClientResult<T>> {
  const target = new URL(url);
  const payload =
    options.body === undefined
      ? undefined
      : Buffer.from(JSON.stringify(options.body), 'utf8');

  return new Promise<JsonClientResult<T>>((resolve, reject) => {
    const request = httpRequest(
      target,
      {
        method: options.method ?? (payload ? 'POST' : 'GET'),
        headers: {
          ...(payload
            ? {
                'content-type': 'application/json',
                'content-length': String(payload.byteLength),
              }
            : {}),
          ...(options.headers ?? {}),
        },
      },
      (response) => {
        const chunks: Buffer[] = [];
        response.on('data', (chunk: Buffer) => chunks.push(chunk));
        response.on('error', reject);
        response.on('end', () => {
          const text = Buffer.concat(chunks).toString('utf8');
          if (text.trim() === '') {
            resolve({
              status: response.statusCode ?? 0,
              headers: response.headers,
              body: undefined as T,
            });
            return;
          }

          try {
            resolve({
              status: response.statusCode ?? 0,
              headers: response.headers,
              body: JSON.parse(text) as T,
            });
          } catch (error) {
            reject(new Error('响应不是合法 JSON', { cause: error }));
          }
        });
      },
    );

    request.on('error', reject);

    if (options.timeoutMs !== undefined) {
      request.setTimeout(options.timeoutMs, () => {
        request.destroy(
          new Error(`请求超时（${options.timeoutMs}ms）`),
        );
      });
    }

    if (payload) {
      request.write(payload);
    }
    request.end();
  });
}
