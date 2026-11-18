import { connect } from 'node:net';
import { setTimeout as sleep } from 'node:timers/promises';

/**
 * 企业级练习：等待 TCP 端口就绪
 *
 * 场景：应用启动时等待数据库/Redis/下游服务监听就绪；测试等待被测服务
 * 可连接。TCP 可连接不代表业务已就绪，关键依赖仍应有健康检查。
 *
 * 函数签名
 *   waitForPort(port: number, options?: WaitForPortOptions): Promise<void>
 *   - port：目标端口号，必须是 1-65535 的整数
 *   - options.host：目标地址，默认 '127.0.0.1'
 *   - options.timeoutMs：总超时毫秒数，默认 10000，必须是正数
 *   - options.intervalMs：重试间隔毫秒数，默认 200，必须是非负数
 *   - 返回：连接成功时 resolve(undefined)；超时抛 Error
 *
 * 示例
 *   await waitForPort(3000, { timeoutMs: 2000, intervalMs: 10 })
 *   // 服务已监听时立即 resolve；稍后启动时轮询直到连接成功
 *
 *   await waitForPort(port, { timeoutMs: 50, intervalMs: 10 })
 *   => 抛 Error('等待端口 127.0.0.1:<port> 超时（50ms）')
 *
 *   await waitForPort(0)                          => 抛 RangeError
 *   await waitForPort(3000, { timeoutMs: 0 })    => 抛 RangeError
 *   await waitForPort(3000, { intervalMs: -1 })  => 抛 RangeError
 *
 * 要求
 *   1. 反复尝试 TCP connect，成功一次即 resolve；
 *   2. 连接失败后按 intervalMs 间隔重试，总时长不超过 timeoutMs；
 *   3. 超时后抛 Error，message 包含 host:port 与毫秒数，格式为
 *      '等待端口 <host>:<port> 超时（<timeoutMs>ms）'；
 *   4. port 必须是 1-65535 的整数，否则抛 RangeError；
 *   5. timeoutMs 必须是正数（> 0），intervalMs 必须是非负数（>= 0），
 *      否则抛 RangeError；
 *   6. 单次连接尝试也受剩余超时约束，避免卡死。
 */
export interface WaitForPortOptions {
  host?: string;
  timeoutMs?: number;
  intervalMs?: number;
}

export async function waitForPort(
  port: number,
  options: WaitForPortOptions = {},
): Promise<void> {
  // TODO
  throw new Error('TODO: waitForPort');
}
