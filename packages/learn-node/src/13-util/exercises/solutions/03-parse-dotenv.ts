import { parseEnv } from 'node:util';

export function parseDotenv(content: string): Record<string, string> {
  if (typeof content !== 'string') {
    throw new TypeError('content 必须是字符串');
  }
  return parseEnv(content) as Record<string, string>;
}
