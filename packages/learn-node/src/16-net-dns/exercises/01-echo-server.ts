import { createServer, type Server, type Socket } from 'node:net';

/**
 * 练习 1：实现 TCP echo 服务器。
 *
 * 要求：
 * - 监听随机端口（listen(0)）和 127.0.0.1；
 * - 把客户端发来的字节原样回写（socket.pipe(socket)）；
 * - 返回 { port, close }；
 * - close 时销毁仍存活的 socket，避免测试/进程挂起。
 *
 * 说明：TCP 是字节流，没有消息边界。真实协议需要长度前缀或分隔符。
 */
export interface EchoServer {
  port: number;
  close(): Promise<void>;
}

export async function startEchoServer(): Promise<EchoServer> {
  // TODO
  throw new Error('TODO: startEchoServer');
}
