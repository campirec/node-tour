/**
 * 企业级练习：结构化 JSON 日志器。
 *
 * 场景：容器日志采集（ELK/Loki）需要单行 JSON；敏感字段绝不能落盘。
 *
 * 要求：
 * - 级别过滤：debug < info < warn < error；
 * - 每条日志包含 time、level、msg，以及 base 与 fields；
 * - 递归脱敏 password/secret/token/authorization/apiKey/api_key；
 * - Error 序列化为 { name, message, stack }；
 * - 循环引用替换为 '[circular]'，超过深度替换为 '[max-depth]'；
 * - child(fields) 返回带合并 base 的新 logger；
 * - now 与 sink 可注入，默认写 stdout；
 * - level 非法时抛 RangeError。
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface JsonLoggerOptions {
  level?: LogLevel;
  now?: () => Date;
  sink?: (line: string) => void;
  base?: Record<string, unknown>;
}

export interface JsonLogger {
  debug(message: string, fields?: Record<string, unknown>): void;
  info(message: string, fields?: Record<string, unknown>): void;
  warn(message: string, fields?: Record<string, unknown>): void;
  error(message: string, fields?: Record<string, unknown>): void;
  child(fields: Record<string, unknown>): JsonLogger;
}

export function createJsonLogger(
  options: JsonLoggerOptions = {},
): JsonLogger {
  // TODO
  throw new Error('TODO: createJsonLogger');
}
