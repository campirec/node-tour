import { parseEnv } from 'node:util';

/**
 * 练习 3：解析 .env 文本。
 *
 * Node 20.12+ 内置 util.parseEnv，不需要 dotenv 包。
 * 支持注释、单双引号、空值、转义等语法。
 *
 * 要求：
 * - 返回普通对象；
 * - 空文本返回空对象；
 * - 非字符串输入抛 TypeError。
 *
 * 注意：parseEnv 只解析，不会写入 process.env。
 */
export function parseDotenv(content: string): Record<string, string> {
  // TODO
  throw new Error('TODO: parseDotenv');
}
