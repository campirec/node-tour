import { z } from 'zod';
import type { ProviderTool } from '../providers/types.js';

export interface ToolContext {
  /** 工具允许访问的工作目录根路径。 */
  cwd: string;
}

export interface AgentTool<TInput = unknown> {
  name: string;
  description: string;
  parameters: z.ZodType<TInput>;
  execute(input: TInput, context: ToolContext): Promise<unknown> | unknown;
}

/** 仅用于保留泛型推断，让 tool 定义获得完整的参数类型。 */
export function defineTool<TInput>(
  tool: AgentTool<TInput>,
): AgentTool<TInput> {
  return tool;
}

/**
 * 把 Zod schema 转成模型可读的 JSON Schema。
 * 去掉 $schema 字段，兼容对 schema 较严格的第三方 OpenAI 兼容服务。
 */
export function toProviderTool(tool: AgentTool): ProviderTool {
  const { $schema: _ignored, ...parameters } = z.toJSONSchema(
    tool.parameters,
    { io: 'input' },
  ) as Record<string, unknown>;

  return {
    name: tool.name,
    description: tool.description,
    parameters,
  };
}
