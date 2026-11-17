export interface ApiPage<T> {
  items: readonly T[];
  nextCursor?: string | null;
}

export interface PaginateOptions {
  maxPages?: number;
}

export async function collectPages<T>(
  fetchPage: (cursor?: string) => Promise<ApiPage<T>>,
  options: PaginateOptions = {},
): Promise<T[]> {
  const maxPages = options.maxPages ?? 100;
  if (!Number.isInteger(maxPages) || maxPages < 1) {
    throw new RangeError('maxPages 必须是正整数');
  }

  const items: T[] = [];
  const seen = new Set<string>();
  let cursor: string | undefined;

  for (let page = 1; page <= maxPages; page += 1) {
    const result = await fetchPage(cursor);
    if (!Array.isArray(result.items)) {
      throw new Error('fetchPage 返回的 items 必须是数组');
    }
    items.push(...result.items);

    const next = result.nextCursor;
    if (next === null || next === undefined) {
      return items;
    }
    if (typeof next !== 'string' || next.length === 0) {
      throw new Error('nextCursor 必须是非空字符串');
    }
    if (seen.has(next)) {
      throw new Error(`检测到重复 cursor：${next}`);
    }

    seen.add(next);
    cursor = next;
  }

  throw new Error(`翻页超过最大页数 ${maxPages}`);
}
