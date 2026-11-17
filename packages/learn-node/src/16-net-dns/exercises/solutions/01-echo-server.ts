import { createServer, type Socket } from 'node:net';

export interface EchoServer {
  port: number;
  close(): Promise<void>;
}

export async function startEchoServer(): Promise<EchoServer> {
  const sockets = new Set<Socket>();
  const server = createServer((socket) => {
    sockets.add(socket);
    socket.once('close', () => sockets.delete(socket));
    socket.pipe(socket);
  });

  await new Promise<void>((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      server.off('error', reject);
      resolve();
    });
  });

  const address = server.address();
  if (!address || typeof address === 'string') {
    throw new Error('服务器没有获得 TCP 端口');
  }

  return {
    port: address.port,
    close: () =>
      new Promise<void>((resolve, reject) => {
        for (const socket of sockets) {
          socket.destroy();
        }
        server.close((error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      }),
  };
}
