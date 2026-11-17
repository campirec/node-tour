import { createServer } from 'node:net';

function assertPort(port: number): void {
  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new RangeError('port 必须是 1-65535 的整数');
  }
}

export async function getFreePort(host = '127.0.0.1'): Promise<number> {
  const server = createServer();

  await new Promise<void>((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, host, () => {
      server.off('error', reject);
      resolve();
    });
  });

  const address = server.address();
  if (!address || typeof address === 'string') {
    throw new Error('服务器没有获得 TCP 端口');
  }

  const port = address.port;
  await new Promise<void>((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
  return port;
}

export async function isPortAvailable(
  port: number,
  host = '127.0.0.1',
): Promise<boolean> {
  assertPort(port);
  const server = createServer();

  return new Promise<boolean>((resolve, reject) => {
    server.once('error', (error: NodeJS.ErrnoException) => {
      if (error.code === 'EADDRINUSE') {
        resolve(false);
      } else {
        reject(error);
      }
    });

    server.listen(port, host, () => {
      server.close((error) => (error ? reject(error) : resolve(true)));
    });
  });
}
