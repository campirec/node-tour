/**
 * 企业级练习：结构化 JSON 日志器
 *
 * 场景：容器日志采集（ELK/Loki）需要单行 JSON 日志；敏感字段（密码、令牌等）
 * 绝不能落盘。需要级别过滤、递归脱敏、循环引用保护，以及 child logger 合并上下文。
 *
 * 函数签名
 *   createJsonLogger(options?: JsonLoggerOptions): JsonLogger
 *   - options.level：最低输出级别，默认 'info'（debug < info < warn < error）
 *   - options.now：时间源注入，默认 () => new Date()
 *   - options.sink：输出函数，默认写 process.stdout
 *   - options.base：每条日志都携带的基础字段
 *   - 返回：JsonLogger，含 debug/info/warn/error 四个方法和 child 方法
 *
 * 示例
 *   const logger = createJsonLogger({ level: 'info', now: () => new Date('2026-01-02T03:04:05.000Z'), sink: fn })
 *   logger.debug('hidden')   // 不输出（低于 info）
 *   logger.info('started', { port: 3000 })
 *   => sink 收到单行 JSON：{ time: '2026-01-02T03:04:05.000Z', level: 'info', msg: 'started', port: 3000 }
 *
 *   logger.info('login', { user: { id: 1, password: 'p@ss' }, authorization: 'Bearer abc' })
 *   => password 和 authorization 字段值替换为 '[redacted]'
 *
 *   const child = logger.child({ requestId: 'req-1' })
 *   child.info('handled', { route: '/tasks' })
 *   => 输出包含 base 字段 + requestId + route + msg
 *
 *   createJsonLogger({ level: 'verbose' as never })  => 抛 RangeError
 *
 * 要求
 *   1. 级别过滤：debug < info < warn < error，低于设定级别的日志不输出；
 *   2. 每条日志为单行 JSON，包含 time（ISO 字符串）、level、msg，以及 base 与 fields；
 *   3. 递归脱敏字段名匹配 password/secret/token/authorization/apiKey/api_key
 *      （不区分大小写）的值为 '[redacted]'；
 *   4. Error 实例序列化为 { name, message, stack }；
 *   5. 循环引用替换为 '[circular]'，超过最大深度替换为 '[max-depth]'；
 *   6. child(fields) 返回新 logger，合并 base 与传入 fields；
 *   7. now 与 sink 可注入，默认写 stdout；
 *   8. level 非法时抛 RangeError。
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
