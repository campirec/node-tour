import { open } from 'node:fs/promises';

export async function readLastLines(
  filePath: string,
  count: number,
  maxBytes = 64 * 1024,
): Promise<string[]> {
  if (!Number.isInteger(count) || count < 1) {
    throw new RangeError('count 必须是正整数');
  }
  if (!Number.isFinite(maxBytes) || maxBytes < 1) {
    throw new RangeError('maxBytes 必须是正数');
  }

  const handle = await open(filePath, 'r');
  try {
    const { size } = await handle.stat();
    if (size === 0) {
      return [];
    }

    const start = Math.max(0, size - Math.floor(maxBytes));
    const readStart = start > 0 ? start - 1 : 0;
    const buffer = Buffer.alloc(size - readStart);
    const { bytesRead } = await handle.read(
      buffer,
      0,
      buffer.length,
      readStart,
    );

    let text = buffer.subarray(0, bytesRead).toString('utf8');
    if (readStart > 0) {
      const firstNewline = text.indexOf('\n');
      if (firstNewline === -1) {
        return [];
      }
      text = text.slice(firstNewline + 1);
    }

    let lines = text.split(/\r?\n/);
    if (lines.at(-1) === '') {
      lines = lines.slice(0, -1);
    }

    return lines.slice(-count);
  } finally {
    await handle.close();
  }
}
