import { lookup } from 'node:dns/promises';

/**
 * 练习 3：解析主机名
 *
 * 场景：连接远端服务前需要把主机名解析为 IP 地址。dns/promises.lookup 使用
 * 操作系统解析器（hosts 文件 + DNS），与 http/fetch 实际连接行为一致；
 * resolve4/resolve6 只走 DNS，不读 hosts 文件。
 *
 * 函数签名
 *   lookupHost(host: string): Promise<LookupResult>
 *   - host：待解析的主机名
 *   - 返回：{ address: string, family: 4 | 6 }
 *
 * 示例
 *   await lookupHost('localhost')
 *   => { address: '127.0.0.1', family: 4 }（或 IPv6 回环，取决于系统配置）
 *
 *   await lookupHost('')
 *   => 抛 Error('host 不能为空')
 *
 * 要求
 *   1. 使用 dns/promises 的 lookup 进行解析；
 *   2. host 为空串时抛 Error('host 不能为空')；
 *   3. 解析成功后返回 { address, family }，family 为 4 或 6；
 *   4. lookup 本身的 DNS/系统错误向上传播，不额外包装。
 */
export interface LookupResult {
  address: string;
  family: 4 | 6;
}

export async function lookupHost(host: string): Promise<LookupResult> {
  // TODO
  throw new Error('TODO: lookupHost');
}
