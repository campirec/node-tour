export interface ReadAllOptions {
  maxBytes?: number;
}

export async function readAll(
  stream: AsyncIterable<Buffer | string>,
  options: ReadAllOptions = {},
): Promise<string> {
  const maxBytes = options.maxBytes ?? 1024 * 1024;
  if (!Number.isInteger(maxBytes) || maxBytes < 1) {
    throw new RangeError('maxBytes 必须是正整数');
  }

  const chunks: Buffer[] = [];
  let total = 0;

  for await (const chunk of stream) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    total += buffer.byteLength;
    if (total > maxBytes) {
      throw new Error(`输入超过 ${maxBytes} 字节上限`);
    }
    chunks.push(buffer);
  }

  return Buffer.concat(chunks).toString('utf8');
}
