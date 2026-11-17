export type QueryValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | readonly (string | number | boolean)[];

export function buildUrl(
  baseUrl: string,
  params: Record<string, QueryValue>,
): string {
  const url = new URL(baseUrl);

  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined) {
      continue;
    }
    if (Array.isArray(value)) {
      for (const item of value) {
        url.searchParams.append(key, String(item));
      }
    } else {
      url.searchParams.append(key, String(value));
    }
  }

  return url.toString();
}
