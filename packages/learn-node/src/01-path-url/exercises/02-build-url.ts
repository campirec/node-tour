/**
 * 练习 2：安全地拼接查询参数。
 *
 * 不要用字符串 + '?' + ... 手工拼接：它会漏掉编码、重复 key、已有查询和 hash。
 *
 * 要求：
 * - baseUrl 必须是绝对 URL，非法时让 URL 构造器抛出 TypeError；
 * - 保留 baseUrl 已有的 query 与 hash；
 * - null / undefined 跳过；
 * - 数组展开为重复的 key；
 * - 其他值转成字符串。
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
