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

  const link = (targetPage: number): string => {
    const url = new URL(baseUrl);
    url.searchParams.set('page', String(targetPage));
    url.searchParams.set('pageSize', String(pageSize));
    return url.toString();
  };

  return {
    self: link(current),
    first: link(1),
    prev: current > 1 ? link(current - 1) : null,
    next: current < totalPages ? link(current + 1) : null,
    last: link(totalPages),
  };
}
