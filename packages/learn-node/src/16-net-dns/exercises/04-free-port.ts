import { createServer } from 'node:net';

/**
 * 企业级练习：动态获取空闲端口与检测端口占用
 *
 * 场景：测试并行启动服务、Worker 启动本地 RPC、避免固定端口冲突。
 *
 * 函数签名
 *   getFreePort(host?: string): Promise<number>
 *   - host：绑定的网卡地址，默认 '127.0.0.1'
 *   - 返回：系统分配的可用端口号
 *
 *   isPortAvailable(port: number, host?: string): Promise<boolean>
 *   - port：待检测的端口号，必须是 1-65535 的整数
 *   - host：绑定的网卡地址，默认 '127.0.0.1'
 *   - 返回：端口可监听返回 true，被占用（EADDRINUSE）返回 false
 *
 * 示例
 *   const port = await getFreePort();
 *   => 一个 1-65535 范围内的可用端口
 *
 *   await isPortAvailable(port)  => true（端口空闲）
 *   // 启动服务占用该端口后
 *   await isPortAvailable(port)  => false（端口被占用）
 *
 *   await isPortAvailable(0)     => 抛 RangeError
 *   await isPortAvailable(70000) => 抛 RangeError
 *   await isPortAvailable(1.5)   => 抛 RangeError
 *
 * 要求
 *   1. getFreePort 通过 listen(0, host) 让系统分配端口，取得端口号后立即关闭服务器；
 *   2. isPortAvailable 尝试在指定端口和 host 上 listen，成功后立即关闭并返回 true；
 *   3. 端口被占用（EADDRINUSE）时返回 false，不抛错；
 *   4. port 必须是 1-65535 的整数，否则抛 RangeError（0、负数、超过 65535、
 *      小数均拒绝）；
 *   5. EADDRINUSE 之外的 listen 错误向上传播，不吞掉。
 *
 * 提示：getFreePort 返回后端口可能被其他进程抢占，真正启动时仍需处理 EADDRINUSE。
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
