import { parseArgs } from 'node:util';

/**
 * 练习 1：解析命令行参数
 *
 * 场景：CLI 工具启动时从 argv 提取 host、port、verbose 与位置参数（文件列表）。
 * 传入的 argv 不含 node 与脚本路径，直接从 process.argv.slice(2) 获得。
 *
 * 函数签名
 *   parseCli(argv: readonly string[]): CliOptions
 *   - argv：参数数组，不含 node 与脚本路径
 *   - 返回：{ host, port, verbose, files }
 *
 * 示例
 *   parseCli([])
 *   => { host: 'localhost', port: 3000, verbose: false, files: [] }
 *
 *   parseCli(['--host', '0.0.0.0', '--port', '8080', '-v', 'a.txt', 'b.txt'])
 *   => { host: '0.0.0.0', port: 8080, verbose: true, files: ['a.txt', 'b.txt'] }
 *
 *   parseCli(['--port=8080', '--', '--not-a-flag'])
 *   => { host: 'localhost', port: 8080, verbose: false, files: ['--not-a-flag'] }
 *
 *   parseCli(['--port', 'abc'])     => 抛 RangeError
 *   parseCli(['--port', '70000'])   => 抛 RangeError
 *   parseCli(['--unknown'])         => 抛错（strict 模式未知选项）
 *
 * 要求
 *   1. host 默认 'localhost'，port 默认 3000，verbose 默认 false，files 默认 []；
 *   2. 支持 --host <值>、--port <值>、--port=<值>、-v（布尔）等形式；
 *   3. 位置参数（含 -- 之后的）作为 files 数组返回；
 *   4. port 必须是 1-65535 的整数，否则抛 RangeError；
 *   5. 使用 node:util 的 parseArgs，strict 模式下未知选项自动报错。
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
