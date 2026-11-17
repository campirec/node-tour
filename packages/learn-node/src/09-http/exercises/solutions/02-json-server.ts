import {
  createServer,
  type IncomingHttpHeaders,
  type IncomingMessage,
  type Server,
  type ServerResponse,
} from 'node:http';

export interface JsonRequest {
  method: string;
  url: URL;
  headers: IncomingHttpHeaders;
  body: unknown;
}

export interface JsonResponse {
  status?: number;
  headers?: Record<string, string>;
  body?: unknown;
}

export type JsonHandler = (
  request: JsonRequest,
) => JsonResponse | Promise<JsonResponse>;

const MAX_BODY_BYTES = 1024 * 1024;

export function createJsonServer(handler: JsonHandler): Server {
  return createServer((request, response) => {
    void handleRequest(request, response, handler);
  });
}

async function handleRequest(
  request: IncomingMessage,
  response: ServerResponse,
  handler: JsonHandler,
): Promise<void> {
  try {
    const method = request.method ?? 'GET';
    const host = request.headers.host ?? 'localhost';
    const url = new URL(request.url ?? '/', `http://${host}`);
    const body = ['POST', 'PUT', 'PATCH'].includes(method)
      ? await readBody(request, MAX_BODY_BYTES)
      : undefined;

    const result = await handler({
      method,
      url,
      headers: request.headers,
      body,
    });

    sendJson(response, result);
  } catch (error) {
    if (response.headersSent) {
      response.end();
      return;
    }

    if (error instanceof SyntaxError) {
      sendJson(response, {
        status: 400,
        body: { error: error.message },
      });
      return;
    }
    if (error instanceof RangeError) {
      sendJson(response, {
        status: 413,
        body: { error: error.message },
      });
      return;
    }

    sendJson(response, {
      status: 500,
      body: { error: 'Internal Server Error' },
    });
  }
}

async function readBody(
  request: IncomingMessage,
  maxBytes: number,
): Promise<unknown> {
  const chunks: Buffer[] = [];
  let total = 0;

  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    total += buffer.byteLength;
    if (total > maxBytes) {
      request.resume();
      throw new RangeError(`请求体超过 ${maxBytes} 字节上限`);
    }
    chunks.push(buffer);
  }

  if (total === 0) {
    throw new SyntaxError('请求体为空');
  }

  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8')) as unknown;
  } catch (error) {
    throw new SyntaxError('请求体不是合法 JSON', { cause: error });
  }
}

function sendJson(response: ServerResponse, result: JsonResponse): void {
  const status = result.status ?? 200;
  const headers = {
    'content-type': 'application/json; charset=utf-8',
    ...(result.headers ?? {}),
  };

  if (status === 204) {
    response.writeHead(status, headers);
    response.end();
    return;
  }

  const payload =
    result.body === undefined ? '' : JSON.stringify(result.body);
  response.writeHead(status, {
    ...headers,
    'content-length': Buffer.byteLength(payload),
  });
  response.end(payload);
}
