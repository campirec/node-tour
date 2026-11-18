import { createServer, type Server, type Socket } from 'node:net';

/**
 * 练习 1：实现 TCP echo 服务器
 *
 * 场景：调试网络协议、测试客户端连接逻辑时需要一个把收到的字节原样回写的
 * 服务器。TCP 是字节流，没有消息边界，真实协议需要长度前缀或分隔符。
 *
 * 函数签名
 *   startEchoServer(): Promise<EchoServer>
 *   - 返回：{ port: number, close(): Promise<void> }
 *   - port：服务器实际监听的端口号
 *   - close()：关闭服务器并销毁所有存活的连接，返回 Promise 在完全关闭后 resolve
 *
 * 示例
 *   const server = await startEchoServer();
 *   // 客户端连接后发送 'ping'，会收到 'ping'
 *   await server.close();
 *
 * 要求
 *   1. 监听随机端口（listen(0)）并绑定 127.0.0.1；
 *   2. 把客户端发来的字节原样回写（socket.pipe(socket)）；
 *   3. 返回的 port 是系统分配的实际端口号；
 *   4. close() 时先销毁所有仍存活的 socket，再关闭 server，避免进程挂起；
 *   5. listen 失败时向上传播错误。
 */
export interface EchoServer {
  port: number;
  close(): Promise<void>;
}

export async function startEchoServer(): Promise<EchoServer> {
  // TODO
  throw new Error('TODO: startEchoServer');
}
