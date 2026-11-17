import { z } from 'zod';

/**
 * 所有环境变量在进程启动时集中校验：
 * - 缺失时有明确默认值；
 * - 非法值立即失败，而不是等到运行时才暴露；
 * - 类型从 schema 推导，ConfigService 读取时保持一致。
 */
export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z.coerce.number().int().min(1).max(65_535).default(3000),
  HOST: z.string().min(1).default('0.0.0.0'),
  LOG_LEVEL: z
    .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace'])
    .default('info'),
  CORS_ORIGINS: z.string().default('http://localhost:5173'),
});

export type Env = z.infer<typeof envSchema>;

export function formatEnvError(error: z.ZodError): string {
  return error.issues
    .map((issue) => `${issue.path.join('.') || '(root)'}: ${issue.message}`)
    .join('\n');
}

export function loadEnv(source: NodeJS.ProcessEnv = process.env): Env {
  const result = envSchema.safeParse(source);
  if (!result.success) {
    throw new Error(`环境变量校验失败：\n${formatEnvError(result.error)}`);
  }
  return result.data;
}

/** CORS_ORIGINS 支持逗号分隔的多个来源。 */
export function parseCorsOrigins(value: string): string[] {
  return value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}
