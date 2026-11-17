import { createRequire } from 'node:module';

export function requireFromEsm<T = unknown>(
  metaUrl: string,
  request: string,
): T {
  const require = createRequire(metaUrl);
  return require(request) as T;
}
