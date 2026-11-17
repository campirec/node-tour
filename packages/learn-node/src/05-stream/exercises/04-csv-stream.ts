import type { Readable } from 'node:stream';

/**
 * 企业级练习：流式解析 CSV。
 *
 * 场景：运营后台导入供应商/客户数据、财务对账文件。文件可能几百 MB，
 * 不能 readFile 后 split('\n')。
 *
 * 要求：
 * - 首个 chunk 去掉 UTF-8 BOM；
 * - 支持逗号、双引号包裹、字段内逗号/换行、双引号转义（""）；
 * - 支持 \n 与 \r\n；引号内的换行保留；
 * - 默认第一行是表头；表头重复/为空、行列数不一致时抛 CsvParseError；
 * - hasHeader=false 时生成 column_1、column_2...
 * - 空行跳过；流式逐行 yield，不整体缓存文件。
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
