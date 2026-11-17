import { parseArgs } from 'node:util';

/**
 * 练习 1：解析命令行参数。
 *
 * 支持：
 *   node cli.mjs --host 0.0.0.0 --port 8080 -v file1 file2
 *   node cli.mjs --port=8080 -- file-with-dashes.txt
 *
 * 要求：
 * - host 默认 localhost，port 默认 3000，verbose 默认 false；
 * - --port 必须是 1-65535 的整数，否则抛出 RangeError；
 * - 位置参数作为 files 返回；
 * - 使用 util.parseArgs，strict 模式负责未知参数报错。
 *
 * 注意：传入的 argv 不含 node 与脚本路径。
 */
export interface CliOptions {
  host: string;
  port: number;
  verbose: boolean;
  files: string[];
}

export function parseCli(argv: readonly string[]): CliOptions {
  // TODO: parseArgs({ args: [...argv], options, allowPositionals: true })
  throw new Error('TODO: parseCli');
}
