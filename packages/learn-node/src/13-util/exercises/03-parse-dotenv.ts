import { parseEnv } from 'node:util';

/**
 * 练习 3：用 util.parseEnv 解析 .env 文本
 *
 * 场景：Node 22.5+ 内置 util.parseEnv（本仓库要求 >= 22.12），不需要第三方
 * dotenv 包。它支持
 * 注释、单双引号、空值、转义等语法，将 .env 文本解析为键值对对象。
 *
 * 函数签名
 *   parseDotenv(content: string): Record<string, string>
 *   - content：.env 格式的文本内容
 *   - 返回：键值对普通对象
 *
 * 示例
 *   parseDotenv('FOO=bar\n# comment\nQUOTED="hello world"\nSINGLE=\'a b\'\nEMPTY=')
 *   => { FOO: 'bar', QUOTED: 'hello world', SINGLE: 'a b', EMPTY: '' }
 *
 *   parseDotenv('')  => {}
 *
 *   parseDotenv(null as unknown as string)  => 抛 TypeError
 *
 * 要求
 *   1. 返回普通对象，键值均为字符串；
 *   2. 支持注释行、双引号、单引号、空值等 .env 语法；
 *   3. 空文本返回空对象（无键）；
 *   4. 非字符串输入抛 TypeError；
 *   5. parseEnv 只解析文本，不会写入 process.env。
 */
export function parseDotenv(content: string): Record<string, string> {
  // TODO
  throw new Error('TODO: parseDotenv');
}
