export function splitBuffer(data: Buffer, delimiter: Buffer): Buffer[] {
  if (delimiter.length === 0) {
    throw new Error('分隔符不能为空');
  }

  const parts: Buffer[] = [];
  let start = 0;

  for (;;) {
    const index = data.indexOf(delimiter, start);
    if (index === -1) {
      parts.push(data.subarray(start));
      return parts;
    }
    parts.push(data.subarray(start, index));
    start = index + delimiter.length;
  }
}
