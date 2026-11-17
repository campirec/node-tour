import type { Readable } from 'node:stream';
import { StringDecoder } from 'node:string_decoder';

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
  const delimiter = options.delimiter ?? ',';
  const quote = options.quote ?? '"';
  const hasHeader = options.hasHeader ?? true;

  if ([...delimiter].length !== 1 || [...quote].length !== 1) {
    throw new RangeError('delimiter 与 quote 必须是单个字符');
  }
  if (delimiter === quote) {
    throw new RangeError('delimiter 与 quote 不能相同');
  }

  const decoder = new StringDecoder('utf8');
  let header: string[] | undefined;
  let field = '';
  let row: string[] = [];
  let inQuotes = false;
  let quotePending = false;
  let rowNumber = 0;
  let firstChunk = true;
  const completedRows: string[][] = [];

  const parseText = (text: string): void => {
    for (let index = 0; index < text.length; index += 1) {
      const char = text[index] as string;

      if (inQuotes) {
        if (quotePending) {
          if (char === quote) {
            field += quote;
            quotePending = false;
          } else {
            inQuotes = false;
            quotePending = false;
            index -= 1; // 重新按引号外字符处理
          }
        } else if (char === quote) {
          quotePending = true;
        } else {
          field += char;
        }
        continue;
      }

      if (char === quote) {
        if (field.length === 0) {
          inQuotes = true;
        } else {
          throw new CsvParseError('未转义的引号', rowNumber + 1);
        }
        continue;
      }

      if (char === delimiter) {
        row.push(field);
        field = '';
        continue;
      }

      if (char === '\n') {
        row.push(field);
        field = '';
        completedRows.push(row);
        row = [];
        continue;
      }

      if (char === '\r') {
        // 引号外的 CRLF 在这里跳过 \r，由 \n 结束行。
        continue;
      }

      field += char;
    }
  };

  const toRecord = (rawRow: string[]): Record<string, string> | undefined => {
    rowNumber += 1;

    if (rawRow.length === 1 && rawRow[0] === '') {
      return undefined;
    }

    if (!header) {
      if (hasHeader) {
        if (rawRow.some((key) => key.length === 0)) {
          throw new CsvParseError('表头不能包含空列名', rowNumber);
        }
        if (new Set(rawRow).size !== rawRow.length) {
          throw new CsvParseError('表头重复', rowNumber);
        }
        header = rawRow;
        return undefined;
      }

      header = rawRow.map((_value, index) => `column_${index + 1}`);
    }

    if (rawRow.length !== header.length) {
      throw new CsvParseError(
        `列数不一致，期望 ${header.length} 列，实际 ${rawRow.length} 列`,
        rowNumber,
      );
    }

    const record: Record<string, string> = {};
    header.forEach((key, index) => {
      record[key] = rawRow[index] as string;
    });
    return record;
  };

  const drain = (): Record<string, string>[] => {
    const records: Record<string, string>[] = [];
    for (const rawRow of completedRows.splice(0)) {
      const record = toRecord(rawRow);
      if (record) {
        records.push(record);
      }
    }
    return records;
  };

  for await (const chunk of readable) {
    let text = decoder.write(
      Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk as Uint8Array),
    );
    if (firstChunk) {
      firstChunk = false;
      if (text.startsWith('﻿')) {
        text = text.slice(1);
      }
    }

    parseText(text);
    for (const record of drain()) {
      yield record;
    }
  }

  let tail = decoder.end();
  if (firstChunk && tail.startsWith('﻿')) {
    tail = tail.slice(1);
  }
  if (tail.length > 0) {
    parseText(tail);
  }

  if (quotePending) {
    quotePending = false;
    inQuotes = false;
  }
  if (inQuotes) {
    throw new CsvParseError('引号未闭合', rowNumber + 1);
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    field = '';
    completedRows.push(row);
    row = [];
  }

  for (const record of drain()) {
    yield record;
  }
}
