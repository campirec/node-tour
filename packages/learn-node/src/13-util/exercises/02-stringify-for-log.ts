import { inspect } from 'node:util';

/**
 * 练习 2：生成适合日志的一条字符串。
 *
 * JSON.stringify 的问题：
 * - BigInt 抛错；
 * - 循环引用抛错；
 * - 默认不显示 Map/Set 内容。
 * util.inspect 更宽容，适合调试日志。
 *
 * 要求：
 * - 使用 util.inspect，colors: false，depth: 4，breakLength: 120；
 * - 超过 maxLength 时截断并标注 truncated 与原长度；
 * - 支持循环引用、BigInt、Map/Set；
 * - maxLength 必须是正整数。
 */
export function stringifyForLog(value: unknown, maxLength = 500): string {
  // TODO
  throw new Error('TODO: stringifyForLog');
}
