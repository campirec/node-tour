/**
 * 企业级练习：生成 API 分页链接
 *
 * 场景：列表接口返回分页元数据或 Link header，调用方拿到 self / first / prev /
 * next / last 就能直接翻页，不必自己拼 URL。
 *
 * 函数签名
 *   buildPaginationLinks(baseUrl, page, pageSize, total): PaginationLinks
 *   - baseUrl：完整列表地址，可带已有筛选参数，如 'https://api.test/orders?status=paid'
 *   - page：当前页码，从 1 开始
 *   - pageSize：每页条数，>= 1
 *   - total：总条数，>= 0
 *   - 返回：{ self, first, prev, next, last }，其中 prev / next 在无上一页/下一页时为 null
 *
 * 示例
 *   buildPaginationLinks('https://api.test/v1/tasks?status=todo', 2, 10, 45)
 *   => self  = 'https://api.test/v1/tasks?status=todo&page=2&pageSize=10'
 *      first = '...&page=1&pageSize=10'
 *      prev  = '...&page=1&pageSize=10'
 *      next  = '...&page=3&pageSize=10'
 *      last  = '...&page=5&pageSize=10'
 *
 * 要求
 *   1. baseUrl 上已有的筛选参数全部保留，page 与 pageSize 一律以入参为准（覆盖旧值）；
 *   2. 总页数 = max(1, ceil(total / pageSize))，所以 total=0 时只有 1 页；
 *   3. page 超过总页数时按最后一页生成 self，且 next 为 null；
 *   4. 第 1 页 prev 为 null，最后一页 next 为 null；
 *   5. page / pageSize / total 必须是整数且 page >= 1、pageSize >= 1、total >= 0，
 *      否则抛 RangeError；
 *   6. baseUrl 不是合法绝对 URL 时，让 URL 构造器抛 TypeError，不要捕获后忽略。
 */
export interface PaginationLinks {
  self: string;
  first: string;
  prev: string | null;
  next: string | null;
  last: string;
}

export function buildPaginationLinks(
  baseUrl: string,
  page: number,
  pageSize: number,
  total: number,
): PaginationLinks {
  if (!Number.isInteger(page) || page < 1) {
    throw new RangeError('page 必须是 >= 1 的整数');
  }
  if (!Number.isInteger(pageSize) || pageSize < 1) {
    throw new RangeError('pageSize 必须是 >= 1 的整数');
  }
  if (!Number.isInteger(total) || total < 0) {
    throw new RangeError('total 必须是 >= 0 的整数');
  }

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(page, totalPages);

  // 故意不捕获 new URL 的 TypeError：非法 baseUrl 直接冒泡
  const toLink = (targetPage: number): string => {
    const url = new URL(baseUrl);
    url.searchParams.set('page', String(targetPage));
    url.searchParams.set('pageSize', String(pageSize));
    return url.toString();
  };

  return {
    self: toLink(current),
    first: toLink(1),
    prev: current > 1 ? toLink(current - 1) : null,
    next: current < totalPages ? toLink(current + 1) : null,
    last: toLink(totalPages),
  };
}
