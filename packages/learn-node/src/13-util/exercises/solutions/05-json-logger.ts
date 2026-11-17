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

const LEVEL_VALUE: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

const SENSITIVE_KEY =
  /(password|passwd|secret|token|authorization|api[_-]?key|credential)/i;

function sanitize(
  value: unknown,
  seen: WeakSet<object> = new WeakSet(),
  depth = 0,
): unknown {
  if (value instanceof Error) {
    return {
      name: value.name,
      message: value.message,
      stack: value.stack,
    };
  }
  if (value === null || typeof value !== 'object') {
    return value;
  }
  if (depth >= 6) {
    return '[max-depth]';
  }
  if (seen.has(value)) {
    return '[circular]';
  }
  seen.add(value);

  if (Array.isArray(value)) {
    return value.map((item) => sanitize(item, seen, depth + 1));
  }

  const result: Record<string, unknown> = {};
  for (const [key, item] of Object.entries(value)) {
    result[key] = SENSITIVE_KEY.test(key)
      ? '[redacted]'
      : sanitize(item, seen, depth + 1);
  }
  return result;
}

export function createJsonLogger(
  options: JsonLoggerOptions = {},
): JsonLogger {
  const level = options.level ?? 'info';
  if (!(level in LEVEL_VALUE)) {
    throw new RangeError(`非法日志级别：${String(level)}`);
  }

  const threshold = LEVEL_VALUE[level];
  const now = options.now ?? (() => new Date());
  const sink =
    options.sink ?? ((line: string) => process.stdout.write(`${line}\n`));
  const base = options.base ?? {};

  const write = (
    logLevel: LogLevel,
    message: string,
    fields: Record<string, unknown> = {},
  ): void => {
    if (LEVEL_VALUE[logLevel] < threshold) {
      return;
    }

    const record = {
      ...(sanitize(base) as Record<string, unknown>),
      ...(sanitize(fields) as Record<string, unknown>),
      time: now().toISOString(),
      level: logLevel,
      msg: message,
    };
    sink(JSON.stringify(record));
  };

  return {
    debug: (message, fields) => write('debug', message, fields),
    info: (message, fields) => write('info', message, fields),
    warn: (message, fields) => write('warn', message, fields),
    error: (message, fields) => write('error', message, fields),
    child(fields): JsonLogger {
      return createJsonLogger({
        ...options,
        level,
        now,
        sink,
        base: { ...base, ...fields },
      });
    },
  };
}
