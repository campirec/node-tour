import { lookup } from 'node:dns/promises';

export interface LookupResult {
  address: string;
  family: 4 | 6;
}

export async function lookupHost(host: string): Promise<LookupResult> {
  if (!host) {
    throw new Error('host 不能为空');
  }

  const result = await lookup(host);
  return {
    address: result.address,
    family: result.family as 4 | 6,
  };
}
