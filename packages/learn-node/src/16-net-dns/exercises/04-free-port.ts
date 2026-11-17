import { createServer } from 'node:net';

/**
 * 企业级练习：动态获取空闲端口与检测端口占用。
 *
 * 场景：测试并行启动服务、Worker 启动本地 RPC、避免固定端口冲突。
 *
 * 要求：
 * - getFreePort 监听 0 端口，取得系统分配端口后立即关闭；
 * - 默认 host 为 127.0.0.1；
 * - isPortAvailable 端口被占用返回 false，可用返回 true；
 * - 端口必须是 1-65535 的整数，否则抛 RangeError；
 * - listen 的其他错误向上传播。
 *
 * 注意：getFreePort 返回后端口可能被其他进程抢占，真正启动时仍需处理 EADDRINUSE。
 */
export async function getFreePort(host = '127.0.0.1'): Promise<number> {
  // TODO
  throw new Error('TODO: getFreePort');
}

export async function isPortAvailable(
  port: number,
  host = '127.0.0.1',
): Promise<boolean> {
  // TODO
  throw new Error('TODO: isPortAvailable');
}
