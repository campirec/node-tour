export function withCacheBust(
  url: string,
  version: string | number,
): string {
  if (version === '') {
    throw new RangeError('version 不能为空');
  }

  const parsed = new URL(url);
  parsed.searchParams.set('v', String(version));
  return parsed.toString();
}
