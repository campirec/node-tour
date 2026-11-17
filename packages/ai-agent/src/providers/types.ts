/**
 * 这里定义的是 Agent 与模型之间的最小协议。
 * 具体 SDK（OpenAI 兼容实现）只在 providers/openai-compatible.ts 中出现，
 * 因此测试可以注入假 Provider，不产生任何网络请求。
 */
export interface ToolCall {
  id: string;
  name: string;
  argumentsJson: string;
}

export type ProviderMessage =
  | { role: 'system'; content: string }
  | { role: 'user'; content: string }
  | {
      role: 'assistant';
      content: string | null;
      toolCalls?: ToolCall[];
    }
  | { role: 'tool'; toolCallId: string; content: string };

export interface ProviderTool {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
}

export interface AssistantTurn {
  content: string | null;
  toolCalls: ToolCall[];
}

export interface CompleteInput {
  messages: ProviderMessage[];
  tools: ProviderTool[];
}

export interface ChatProvider {
  complete(input: CompleteInput): Promise<AssistantTurn>;
}
