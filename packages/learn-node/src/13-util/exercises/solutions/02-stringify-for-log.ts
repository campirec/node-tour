import { inspect } from 'node:util';

export function stringifyForLog(value: unknown, maxLength = 500): string {
  if (!Number.isInteger(maxLength) || maxLength < 1) {
    throw new RangeError('maxLength 必须是正整数');
  }

  const text = inspect(value, {
    colors: false,
    depth: 4,
    breakLength: 120,
    compact: 3,
    maxArrayLength: 20,
    maxStringLength: 200,
  });

  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength)}… [truncated ${text.length - maxLength} chars]`;
}
