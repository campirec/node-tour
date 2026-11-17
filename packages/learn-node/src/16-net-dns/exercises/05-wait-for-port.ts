import { connect } from 'node:net';
import { setTimeout as sleep } from 'node:timers/promises';

/**
 * 企业级练习：等待 TCP 端口就绪。
 *
 * 场景：应用启动时等待数据库/Redis/下游服务；测试等待被测服务监听。
 *
 * 要求：
 * - 反复尝试 TCP connect，成功一次即 resolve；
 * - 连接失败后按 intervalMs 重试，总时长不超过 timeoutMs；
 * - 超时抛出包含 host:port 与毫秒数的错误；
 * - 端口必须是 1-65535 的整数；
 * - timeoutMs 必须是正数，intervalMs 必须是非负数；
 * - 单次连接也要受剩余超时约束，避免卡死。
 *
 * 注意：TCP 可连接不代表业务已就绪，关键依赖仍应有健康检查。
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
