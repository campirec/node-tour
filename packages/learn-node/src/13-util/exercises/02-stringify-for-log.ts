import { inspect } from 'node:util';

/**
 * 练习 2：生成适合日志的字符串
 *
 * 场景：JSON.stringify 在遇到 BigInt、循环引用时抛错，且默认不展示 Map/Set
 * 内容。util.inspect 更宽容，适合调试日志，但需要限制输出长度避免日志爆炸。
 *
 * 函数签名
 *   stringifyForLog(value: unknown, maxLength?: number): string
 *   - value：任意值，可含循环引用、BigInt、Map/Set
 *   - maxLength：最大输出长度，默认 500，必须是正整数
 *   - 返回：inspect 后的字符串，超长时截断并标注
 *
 * 示例
 *   stringifyForLog({ user: { id: 1, roles: new Set(['admin']) }, big: 10n })
 *   => 含 'user'、'admin'、'10n' 的字符串
 *
 *   stringifyForLog({ data: 'x'.repeat(1000) }, 50)
 *   => 含 'truncated' 的截断字符串，长度 > 50
 *
 *   stringifyForLog({}, 0)  => 抛 RangeError
 *   stringifyForLog({}, 1.5)  => 抛 RangeError
 *
 * 要求
 *   1. 使用 util.inspect，选项 colors: false、depth: 4、breakLength: 120；
 *   2. 支持循环引用（不抛错）、BigInt、Map/Set（内容可见）；循环引用沿用
 *      util.inspect 的 <ref *1> / [Circular *1] 标记，不要替换成别的占位符；
 *   3. 输出长度超过 maxLength 时截断到 maxLength，并追加
 *      '… [truncated <被截掉的字符数> chars]'（不是原始长度）；
 *   4. maxLength 必须是正整数（Number.isInteger && >= 1），否则抛 RangeError。
 */
export function stringifyForLog(value: unknown, maxLength = 500): string {
  // TODO
  throw new Error('TODO: stringifyForLog');
}
