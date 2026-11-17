import { isIP } from 'node:net';

export type HostKind = 'ipv4' | 'ipv6' | 'hostname';

export function classifyHost(host: string): HostKind {
  const version = isIP(host.trim());
  if (version === 4) {
    return 'ipv4';
  }
  if (version === 6) {
    return 'ipv6';
  }
  return 'hostname';
}
