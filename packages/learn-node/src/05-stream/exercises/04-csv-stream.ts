import type { Readable } from 'node:stream';

/**
 * 企业级练习：流式解析 CSV
 *
 * 场景：运营后台导入供应商/客户数据、财务对账文件。文件可能几百 MB，
 * 不能 readFile 后 split('\n')，需要流式逐行解析。
 *
 * 函数签名
 *   parseCsvStream(readable: Readable, options?: CsvOptions):
 *     AsyncGenerator<Record<string, string>>
 *   - readable：可读流，chunk 可以是 Buffer 或 string
 *   - options.delimiter：字段分隔符，默认 ','
 *   - options.quote：引用字符，默认 '"'
 *   - options.hasHeader：是否将首行作为表头，默认 true
 *   - 返回：异步生成器，逐行 yield 以表头为 key 的对象
 *
 * 示例
 *   输入 '﻿id,name\r\n1,张三\r\n2,李四\r\n'（含 BOM、CRLF）
 *   => [{ id: '1', name: '张三' }, { id: '2', name: '李四' }]
 *
 *   输入 '1;Alice\n2;Bob\n', { delimiter: ';', hasHeader: false }
 *   => [{ column_1: '1', column_2: 'Alice' },
 *       { column_1: '2', column_2: 'Bob' }]
 *
 *   输入 'a,b\n1\n'（列数不一致）
 *   => rejects，CsvParseError，row = 2
 *
 * 要求
 *   1. 首个 chunk 去掉 UTF-8 BOM（\uFEFF）；
 *   2. 支持双引号包裹字段：字段内含逗号、换行时用引号包裹；
 *   3. 支持双引号转义——引号内出现的 "" 表示一个字面双引号；
 *   4. 支持 \n 与 \r\n 换行符；引号内的换行保留为字段内容；
 *   5. 多字节字符（如中文）和引号字段被拆到多个 chunk 时仍能正确解析；
 *   6. 默认第一行为表头；hasHeader=false 时列名生成 column_1、column_2…；
 *   7. 表头重复时抛 CsvParseError（消息含 '表头重复'）；
 *   8. 数据行列数与表头不一致时抛 CsvParseError，row 为数据行号；
 *   9. 引号未闭合时抛 CsvParseError；
 *   10. 空行跳过，不 yield；
 *   11. 流式逐行 yield，不整体缓存文件内容。
 */
export class CsvParseError extends Error {
  readonly row: number;

  constructor(message: string, row: number, options?: ErrorOptions) {
    super(`CSV 第 ${row} 行：${message}`, options);
    this.name = 'CsvParseError';
    this.row = row;
  }
}

export interface CsvOptions {
  delimiter?: string;
  quote?: string;
  hasHeader?: boolean;
}

export async function* parseCsvStream(
  readable: Readable,
  options: CsvOptions = {},
): AsyncGenerator<Record<string, string>> {
  // TODO
  throw new Error('TODO: parseCsvStream');
}
