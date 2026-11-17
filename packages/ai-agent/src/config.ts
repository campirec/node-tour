import { z } from 'zod';

/**
 * 兼容任何实现 OpenAI Chat Completions 协议的服务：
 * - OpenAI
 * - DeepSeek
 * - 通义千问 / Moonshot / 智谱等兼容端点
 * - 本地 Ollama（http://localhost:11434/v1）
 */
export const configSchema = z.object({
  OPENAI_API_KEY: z.string().min(1, '缺少 OPENAI_API_KEY'),
  OPENAI_BASE_URL: z.string().url().optional(),
  OPENAI_MODEL: z.string().min(1).default('gpt-4o-mini'),
  AGENT_TEMPERATURE: z.coerce.number().min(0).max(2).default(0.2),
  AGENT_MAX_STEPS: z.coerce.number().int().min(1).max(20).default(6),
  AGENT_MAX_HISTORY: z.coerce.number().int().min(4).max(200).default(40),
});

export type AgentConfig = z.infer<typeof configSchema>;

export function formatConfigError(error: z.ZodError): string {
  return error.issues
    .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
    .join('\n');
}

export function parseConfig(source: NodeJS.ProcessEnv): AgentConfig {
  const result = configSchema.safeParse(source);
  if (!result.success) {
    throw new Error(`Agent 配置无效：\n${formatConfigError(result.error)}`);
  }
  return result.data;
}

/** .env 可选；不存在时继续使用真实环境变量。 */
export function loadConfig(
  source?: NodeJS.ProcessEnv,
  envFile = '.env',
): AgentConfig {
  if (!source) {
    try {
      process.loadEnvFile(envFile);
    } catch (error) {
      const code = (error as NodeJS.ErrnoException).code;
      if (code !== 'ENOENT') {
        throw error;
      }
    }
  }
  return parseConfig(source ?? process.env);
}
