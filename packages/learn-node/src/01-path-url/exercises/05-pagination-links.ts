/**
 * 企业级练习：生成 API 分页链接。
 *
 * 场景：列表接口返回 Link header 或分页元数据，前端/调用方无需自己拼 URL。
 *
 * 要求：
 * - 保留 baseUrl 上已有的筛选参数；
 * - 覆盖已有的 page/pageSize；
 * - page 超出总页数时按最后一页生成 self；
 * - total=0 时总页数为 1；
 * - 参数必须是合法整数，否则抛 RangeError；
 * - 非法 baseUrl 让 URL 构造器抛 TypeError。
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
  // TODO
  throw new Error('TODO: buildPaginationLinks');
}
