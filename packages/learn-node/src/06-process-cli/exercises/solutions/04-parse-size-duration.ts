const SIZE_UNITS = {
  B: 1,
  KB: 1024,
  MB: 1024 ** 2,
  GB: 1024 ** 3,
  TB: 1024 ** 4,
} as const;

const DURATION_UNITS = {
  MS: 1,
  S: 1000,
  M: 60_000,
  H: 3_600_000,
  D: 86_400_000,
} as const;

const SIZE_PATTERN = /^(\d+(?:\.\d+)?)\s*(B|KB|MB|GB|TB)?$/i;
const DURATION_PATTERN = /^(\d+(?:\.\d+)?)\s*(MS|S|M|H|D)?$/i;

function parseUnitValue(
  input: string,
  pattern: RegExp,
  units: Record<string, number>,
  defaultUnit: string,
  kind: string,
): number {
  const match = pattern.exec(input.trim());
  if (!match) {
    throw new RangeError(`无法解析${kind}：${input}`);
  }

  const value = Number(match[1]);
  const unit = (match[2] ?? defaultUnit).toUpperCase();
  const factor = units[unit];
  if (factor === undefined) {
    throw new RangeError(`不支持的${kind}单位：${unit}`);
  }

  const result = Math.floor(value * factor);
  if (!Number.isSafeInteger(result) || result < 0) {
    throw new RangeError(`${kind}超出安全范围：${input}`);
  }
  return result;
}

export function parseByteSize(input: string): number {
  return parseUnitValue(input, SIZE_PATTERN, SIZE_UNITS, 'B', '容量');
}

export function parseDuration(input: string): number {
  return parseUnitValue(input, DURATION_PATTERN, DURATION_UNITS, 'MS', '时长');
}
