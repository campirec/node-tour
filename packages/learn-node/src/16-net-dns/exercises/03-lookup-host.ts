import { lookup } from 'node:dns/promises';

/**
 * 练习 3：解析主机名。
 *
 * lookup 使用操作系统解析器（hosts 文件 + DNS），与 http/fetch 实际连接行为一致；
 * resolve4/resolve6 只走 DNS，不读 hosts。
 *
 * 要求：
 * - 使用 dns/promises.lookup；
 * - 空 host 抛出 Error('host 不能为空')；
 * - 返回 { address, family }，family 为 4 或 6。
 */
export interface LookupResult {
  address: string;
  family: 4 | 6;
}

export async function lookupHost(host: string): Promise<LookupResult> {
  // TODO
  throw new Error('TODO: lookupHost');
}
