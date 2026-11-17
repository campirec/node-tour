import type {
  AssistantTurn,
  ChatProvider,
  ProviderMessage,
  ToolCall,
} from '../providers/types.js';
import {
  toProviderTool,
  type AgentTool,
  type ToolContext,
} from '../tools/tool.js';
import { AgentError, AgentMaxStepsError } from './errors.js';
import { trimHistory } from './memory.js';
import type { AgentEvent, AgentRunResult } from './types.js';

export interface AgentOptions {
  provider: ChatProvider;
  tools?: AgentTool[];
  systemPrompt?: string;
  maxSteps?: number;
  maxHistoryMessages?: number;
  maxToolResultChars?: number;
  cwd?: string;
  onEvent?: (event: AgentEvent) => void;
}

const DEFAULT_MAX_TOOL_RESULT_CHARS = 20_000;

/**
 * 最小但完整的工具调用循环：
 * user -> assistant(tool_calls) -> tool -> assistant(...) -> final
 *
 * 生产环境还可以继续扩展：并行工具调用、流式输出、重试、预算控制、可观测性。
 * 这里的每一步都通过 AgentEvent 暴露，便于 CLI、日志与测试观察。
 */
export class Agent {
  private readonly provider: ChatProvider;
  private readonly tools = new Map<string, AgentTool>();
  private readonly systemPrompt: string | undefined;
  private readonly maxSteps: number;
  private readonly maxHistoryMessages: number;
  private readonly maxToolResultChars: number;
  private readonly cwd: string;
  private readonly onEvent: ((event: AgentEvent) => void) | undefined;
  private messages: ProviderMessage[] = [];

  constructor(options: AgentOptions) {
    this.provider = options.provider;
    this.systemPrompt = options.systemPrompt;
    this.maxSteps = options.maxSteps ?? 6;
    this.maxHistoryMessages = options.maxHistoryMessages ?? 40;
    this.maxToolResultChars =
      options.maxToolResultChars ?? DEFAULT_MAX_TOOL_RESULT_CHARS;
    this.cwd = options.cwd ?? process.cwd();
    this.onEvent = options.onEvent;

    for (const tool of options.tools ?? []) {
      if (this.tools.has(tool.name)) {
        throw new AgentError(`工具名称重复：${tool.name}`);
      }
      this.tools.set(tool.name, tool);
    }

    this.reset();
  }

  getMessages(): ProviderMessage[] {
    return structuredClone(this.messages);
  }

  reset(): void {
    this.messages = this.systemPrompt
      ? [{ role: 'system', content: this.systemPrompt }]
      : [];
  }

  async run(input: string): Promise<AgentRunResult> {
    const userInput = input.trim();
    if (!userInput) {
      throw new AgentError('输入不能为空');
    }

    this.messages = trimHistory(this.messages, this.maxHistoryMessages);
    this.messages.push({ role: 'user', content: userInput });

    for (let step = 1; step <= this.maxSteps; step += 1) {
      this.onEvent?.({ type: 'step', step });

      const turn = await this.provider.complete({
        messages: this.getMessages(),
        tools: [...this.tools.values()].map(toProviderTool),
      });
      this.messages.push(this.toAssistantMessage(turn));

      if (turn.toolCalls.length === 0) {
        const content = turn.content?.trim() ?? '';
        if (!content) {
          throw new AgentError('模型没有返回文本内容，也没有请求调用工具');
        }
        this.onEvent?.({ type: 'final', content });
        return { content, steps: step, messages: this.getMessages() };
      }

      for (const call of turn.toolCalls) {
        const content = await this.executeTool(call);
        this.messages.push({
          role: 'tool',
          toolCallId: call.id,
          content,
        });
      }
    }

    throw new AgentMaxStepsError(this.maxSteps);
  }

  private toAssistantMessage(turn: AssistantTurn): ProviderMessage {
    return {
      role: 'assistant',
      content: turn.content,
      ...(turn.toolCalls.length > 0 ? { toolCalls: turn.toolCalls } : {}),
    };
  }

  private async executeTool(call: ToolCall): Promise<string> {
    let parsedArgs: unknown;
    try {
      parsedArgs =
        call.argumentsJson.trim() === ''
          ? {}
          : (JSON.parse(call.argumentsJson) as unknown);
    } catch {
      this.onEvent?.({
        type: 'tool-call',
        name: call.name,
        arguments: call.argumentsJson,
      });
      return this.toolError(call.name, '工具参数不是合法 JSON');
    }

    this.onEvent?.({
      type: 'tool-call',
      name: call.name,
      arguments: parsedArgs,
    });

    const tool = this.tools.get(call.name);
    if (!tool) {
      return this.toolError(call.name, `未知工具：${call.name}`);
    }

    const parsed = tool.parameters.safeParse(parsedArgs);
    if (!parsed.success) {
      const issues = parsed.error.issues
        .map((issue) => `${issue.path.join('.') || '(root)'}: ${issue.message}`)
        .join('; ');
      return this.toolError(call.name, `参数校验失败：${issues}`);
    }

    const context: ToolContext = { cwd: this.cwd };
    try {
      const output = await tool.execute(parsed.data, context);
      const content = this.serializeToolResult(output);
      this.onEvent?.({
        type: 'tool-result',
        name: call.name,
        content,
        isError: false,
      });
      return content;
    } catch (error) {
      return this.toolError(
        call.name,
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  private toolError(name: string, message: string): string {
    const content = JSON.stringify({ error: message });
    this.onEvent?.({
      type: 'tool-result',
      name,
      content,
      isError: true,
    });
    return content;
  }

  private serializeToolResult(value: unknown): string {
    let text: string;
    if (typeof value === 'string') {
      text = value;
    } else {
      try {
        text = JSON.stringify(value) ?? String(value);
      } catch {
        text = String(value);
      }
    }

    if (text.length <= this.maxToolResultChars) {
      return text;
    }
    return `${text.slice(0, this.maxToolResultChars)}\n...[工具结果已截断，原始长度 ${text.length} 字符]`;
  }
}
