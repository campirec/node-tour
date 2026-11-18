import { open } from 'node:fs/promises';

/**
 * 企业级练习：读取大日志文件的最后 N 行
 *
 * 场景：管理端点查看最近错误、部署失败时展示日志尾部。
 * 不能把 10GB 日志整个 readFile 进内存，只需从文件末尾读取一小段。
 *
 * 函数签名
 *   readLastLines(filePath: string, count: number, maxBytes?: number): Promise<string[]>
 *   - filePath：日志文件路径
 *   - count：要返回的行数，必须是正整数，否则抛 RangeError
 *   - maxBytes：从文件尾部读取的最大字节数，默认 64KB；必须是正数，否则抛 RangeError
 *   - 返回：最后 count 行的数组（保持原始顺序），不足时返回全部行；
 *           空文件返回 []；文件不存在时保留 ENOENT
 *
 * 示例
 *   // 文件内容：line-1\nline-2\n...\nline-100\n
 *   await readLastLines('/app.log', 3)
 *   => ['line-98', 'line-99', 'line-100']
 *
 *   // 文件内容：a\r\nb\r\nc（无末尾换行，CRLF）
 *   await readLastLines('/app.log', 2)
 *   => ['b', 'c']
 *
 *   // maxBytes=20 覆盖范围截断了上一行，只返回最后的完整行
 *   await readLastLines('/wide.log', 10, 20)
 *   => ['last-line']
 *
 * 要求
 *   1. 用 FileHandle 从文件尾部按 maxBytes 读取，不把整个文件加载进内存；
 *   2. 只返回完整行：如果读取窗口开头截断了一行，从第一个 '\n' 之后开始取，
 *      不把截断的半行当作一行；
 *   3. 支持 '\n' 与 '\r\n' 两种换行符（以 /\r?\n/ 切分）；
 *   4. 末尾换行产生的空串不作为额外行返回；
 *   5. 文件大小为 0 时返回 []；行数不足 count 时返回全部行；
 *   6. count 必须是正整数，maxBytes 必须是正数，否则抛 RangeError；
 *   7. 文件不存在时保留 open 抛出的 ENOENT，不包装。
 */
export async function readLastLines(
  filePath: string,
  count: number,
  maxBytes = 64 * 1024,
): Promise<string[]> {
  // TODO
  throw new Error('TODO: readLastLines');
}
