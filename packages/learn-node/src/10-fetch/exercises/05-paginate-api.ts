/**
 * 企业级练习：消费游标分页 API
 *
 * 场景：同步 CRM/订单/第三方 SaaS 数据，通过 cursor 逐页拉取。
 * 必须防止无上限翻页导致内存/费用失控，以及服务端返回重复 cursor 导致死循环。
 *
 * 函数签名
 *   collectPages<T>(fetchPage: (cursor?: string) => Promise<ApiPage<T>>, options?): Promise<T[]>
 *   - fetchPage：分页获取函数，首页传入 undefined，后续传入上一页的 nextCursor
 *   - options.maxPages：最大页数，默认 100，正整数
 *   - 返回：所有页 items 拼接后的数组
 *
 * 示例
 *   collectPages(async (cursor) => {
 *     if (!cursor) return { items: [1, 2], nextCursor: 'c2' };
 *     if (cursor === 'c2') return { items: [3, 4], nextCursor: 'c3' };
 *     return { items: [5], nextCursor: null };
 *   })
 *   => [1, 2, 3, 4, 5]
 *
 *   collectPages(async () => ({ items: [1], nextCursor: 'dup' }))  // 重复 cursor
 *   => 抛 Error('检测到重复 cursor：dup')
 *
 * 要求
 *   1. 首页调用 fetchPage(undefined)，后续传递上一页的 nextCursor；
 *   2. nextCursor 为 null 或 undefined 时停止，返回已收集的 items；
 *   3. 拼接所有 items，保持顺序；
 *   4. nextCursor 必须是非空字符串，否则抛错；
 *   5. 检测重复 cursor（同一 cursor 出现两次）并抛错，避免死循环；
 *   6. 超过 maxPages 时抛 Error（消息包含 '最大页数'）；
 *   7. maxPages 不是正整数时抛 RangeError；
 *   8. fetchPage 抛出的错误原样向上传播。
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
