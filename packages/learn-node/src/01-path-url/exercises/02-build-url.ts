/**
 * 练习 2：安全地为 URL 追加查询参数
 *
 * 场景：调用下游接口时按需追加筛选、分页参数。用字符串 + '?' + ... 手工拼接
 * 会漏掉特殊字符编码、重复 key、已有查询参数和 hash。
 *
 * 函数签名
 *   buildUrl(baseUrl: string, params: Record<string, QueryValue>): string
 *   - baseUrl：必须是绝对 URL，可以已经带有 query 与 hash
 *   - params：要追加的参数；值为 null / undefined 表示忽略该项
 *   - 返回：追加参数后的完整 URL 字符串
 *
 * 示例
 *   buildUrl('https://api.test/v1/tasks?debug=1#list', {
 *     status: 'done',
 *     page: 2,
 *     tag: ['a', 'b'],
 *     draft: null,
 *   })
 *   => 'https://api.test/v1/tasks?debug=1&status=done&page=2&tag=a&tag=b#list'
 *
 * 要求
 *   1. baseUrl 非法（如 '/relative'）时，让 new URL 抛出 TypeError，不要捕获后忽略；
 *   2. baseUrl 已有的 query 与 hash 必须原样保留；
 *   3. params 中值为 null / undefined 的项直接跳过，不写入 URL；
 *   4. 数组值展开成同名重复 key（tag=a&tag=b），而不是 tag=a,b；
 *   5. 其余值用 String() 转成字符串，false 与 0 要保留，不能被当作空值跳过；
 *   6. 使用 URLSearchParams 的表单编码：空格编码为 '+'（不是 '%20'），
 *      中文与 & = 等字符按 application/x-www-form-urlencoded 编码。
 */
import { URL } from "node:url";

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
  // TODO: new URL(baseUrl)，遍历 params，使用 searchParams.append
  const url = new URL(baseUrl);
  const setSearchParams = (
    searchParams: URLSearchParams,
    key: string,
    value: QueryValue,
  ) => {
    if (value === null || value === undefined) return;
    if (Array.isArray(value)) {
      value.forEach((val) => searchParams.append(key, val));
    } else {
      searchParams.set(key, String(value));
    }
  };
  Object.keys(params).forEach((key) => {
    setSearchParams(url.searchParams, key, params[key]);
  });
  return url.href;
  // throw new Error('TODO: buildUrl');
}
