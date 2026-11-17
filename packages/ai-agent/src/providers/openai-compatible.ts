import OpenAI from 'openai';
import type {
  ChatCompletionMessageParam,
  ChatCompletionTool,
} from 'openai/resources/chat/completions';
import type {
  AssistantTurn,
  ChatProvider,
  CompleteInput,
  ProviderMessage,
  ProviderTool,
} from './types.js';

export interface OpenAICompatibleOptions {
  apiKey: string;
  baseURL?: string;
  model: string;
  temperature?: number;
}

/**
 * OpenAI Chat Completions 协议的适配器。
 * 切换 DeepSeek / Qwen / Ollama 时只需要改 baseURL 与 model。
 */
export class OpenAICompatibleProvider implements ChatProvider {
  readonly model: string;
  private readonly client: OpenAI;
  private readonly temperature: number | undefined;

  constructor(options: OpenAICompatibleOptions) {
    this.model = options.model;
    this.temperature = options.temperature;
    this.client = new OpenAI({
      apiKey: options.apiKey,
      ...(options.baseURL ? { baseURL: options.baseURL } : {}),
      maxRetries: 2,
      timeout: 60_000,
    });
  }

  async complete({ messages, tools }: CompleteInput): Promise<AssistantTurn> {
    const completion = await this.client.chat.completions.create({
      model: this.model,
      messages: messages.map(toOpenAIMessage),
      ...(tools.length > 0
        ? {
            tools: tools.map(toOpenAITool),
            tool_choice: 'auto' as const,
          }
        : {}),
      ...(this.temperature === undefined
        ? {}
        : { temperature: this.temperature }),
    });

    const message = completion.choices[0]?.message;
    if (!message) {
      throw new Error('模型响应缺少 choices[0].message');
    }

    return {
      content: message.content ?? null,
      toolCalls: (message.tool_calls ?? [])
        .filter((call) => call.type === 'function')
        .map((call) => ({
          id: call.id,
          name: call.function.name,
          argumentsJson: call.function.arguments,
        })),
    };
  }
}

function toOpenAIMessage(message: ProviderMessage): ChatCompletionMessageParam {
  switch (message.role) {
    case 'system':
      return { role: 'system', content: message.content };
    case 'user':
      return { role: 'user', content: message.content };
    case 'assistant':
      return {
        role: 'assistant',
        content: message.content,
        ...(message.toolCalls && message.toolCalls.length > 0
          ? {
              tool_calls: message.toolCalls.map((call) => ({
                id: call.id,
                type: 'function' as const,
                function: {
                  name: call.name,
                  arguments: call.argumentsJson,
                },
              })),
            }
          : {}),
      };
    case 'tool':
      return {
        role: 'tool',
        tool_call_id: message.toolCallId,
        content: message.content,
      };
  }
}

function toOpenAITool(tool: ProviderTool): ChatCompletionTool {
  return {
    type: 'function',
    function: {
      name: tool.name,
      description: tool.description,
      parameters: tool.parameters,
    },
  };
}
