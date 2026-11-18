import { isIP } from 'node:net';

/**
 * 练习 2：区分 IPv4、IPv6 与主机名
 *
 * 场景：网络连接前需要根据目标类型选择不同策略（IPv4/v6 直连、主机名需 DNS
 * 解析）。使用 node:net 的 isIP 做纯字符串判断，不做 DNS 查询。
 *
 * 函数签名
 *   classifyHost(host: string): HostKind
 *   - host：待分类的地址字符串，可以是 IP 或域名
 *   - 返回：'ipv4' | 'ipv6' | 'hostname'
 *
 * 示例
 *   classifyHost('127.0.0.1')    => 'ipv4'
 *   classifyHost(' 192.168.1.1 ') => 'ipv4'（先 trim）
 *   classifyHost('::1')          => 'ipv6'
 *   classifyHost('example.com')  => 'hostname'
 *   classifyHost('999.1.1.1')    => 'hostname'（非法 IP 归为主机名）
 *   classifyHost('')             => 'hostname'
 *
 * 要求
 *   1. 先对 host 做 trim 再判断；
 *   2. isIP 返回 4 时返回 'ipv4'，返回 6 时返回 'ipv6'，返回 0 时返回 'hostname'；
 *   3. 非法 IP（如 '999.1.1.1'）和空串都归为 'hostname'，不抛错；
 *   4. 纯函数，不做任何 DNS 查询或网络请求。
 */
export type HostKind = 'ipv4' | 'ipv6' | 'hostname';

export function classifyHost(host: string): HostKind {
  // TODO
  throw new Error('TODO: classifyHost');
}
