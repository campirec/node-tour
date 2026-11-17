/**
 * 企业级练习：消费游标分页 API。
 *
 * 场景：同步 CRM/订单/第三方 SaaS 数据。必须防止：
 * - 无上限翻页导致内存/费用失控；
 * - 服务端返回重复 cursor 导致死循环。
 *
 * 要求：
 * - 首页调用 fetchPage(undefined)，后续传递 nextCursor；
 * - nextCursor 为 null/undefined 时停止；
 * - 拼接所有 items，保持顺序；
 * - 检测重复 cursor 并抛错；
 * - 超过 maxPages（默认 100）抛错；
 * - maxPages 必须是正整数。
 */
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
  // TODO
  throw new Error('TODO: collectPages');
}
