import { isIP } from 'node:net';

/**
 * 练习 2：区分 IPv4、IPv6 与主机名。
 *
 * 要求：
 * - 使用 node:net 的 isIP；
 * - 先 trim；
 * - isIP 返回 4 -> ipv4，6 -> ipv6，其他（包括非法 IPv4）-> hostname；
 * - 纯函数，不做 DNS 查询。
 */
export type HostKind = 'ipv4' | 'ipv6' | 'hostname';

export function classifyHost(host: string): HostKind {
  // TODO
  throw new Error('TODO: classifyHost');
}
