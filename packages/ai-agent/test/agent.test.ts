import { describe, expect, it } from 'vitest';
import { Agent } from '../src/agent/agent.js';
import { AgentMaxStepsError } from '../src/agent/errors.js';
import type { AgentEvent } from '../src/agent/types.js';
import type {
  AssistantTurn,
  ChatProvider,
  CompleteInput,
  ProviderMessage,
} from '../src/providers/types.js';
import { calculatorTool } from '../src/tools/calculator.js';

class ScriptedProvider implements ChatProvider {
  readonly calls: CompleteInput[] = [];
  private readonly turns: AssistantTurn[];

  constructor(turns: AssistantTurn[]) {
    this.turns = [...turns];
  }

  async complete(input: CompleteInput): Promise<AssistantTurn> {
    this.calls.push(structuredClone(input));
    const turn = this.turns.shift();
    if (!turn) {
      throw new Error('ScriptedProvider 没有更多预设回复');
    }
    return turn;
  }
}

function toolContents(messages: ProviderMessage[]): string[] {
  return messages.flatMap((message) =>
    message.role === 'tool' ? [message.content] : [],
  );
}

function finalTurn(content: string): AssistantTurn {
  return { content, toolCalls: [] };
}

function calculatorTurn(
  id: string,
  expression: string,
  argumentsJson = JSON.stringify({ expression }),
): AssistantTurn {
  return {
    content: null,
    toolCalls: [{ id, name: 'calculator', argumentsJson }],
  };
}

describe('Agent', () => {
  it('执行工具调用，把结果回填后生成最终回答', async () => {
    const provider = new ScriptedProvider([
      calculatorTurn('call-1', '2 * (3 + 4)'),
      finalTurn('答案是 14。'),
    ]);
    const events: AgentEvent[] = [];
    const agent = new Agent({
      provider,
      tools: [calculatorTool],
      systemPrompt: '你是测试助手',
      maxSteps: 5,
      onEvent: (event) => events.push(event),
    });

    const result = await agent.run('请计算 2 * (3 + 4)');

    expect(result.content).toBe('答案是 14。');
    expect(result.steps).toBe(2);
    expect(provider.calls[0]?.messages).toEqual([
      { role: 'system', content: '你是测试助手' },
      { role: 'user', content: '请计算 2 * (3 + 4)' },
    ]);
    expect(toolContents(provider.calls[1]?.messages ?? [])).toEqual([
      '{"expression":"2 * (3 + 4)","result":14}',
    ]);
    expect(events.map((event) => event.type)).toEqual([
      'step',
      'tool-call',
      'tool-result',
      'step',
      'final',
    ]);
    expect(result.messages.at(-1)).toEqual({
      role: 'assistant',
      content: '答案是 14。',
    });
  });

  it('未知工具以错误结果回填，不会让进程崩溃', async () => {
    const provider = new ScriptedProvider([
      {
        content: null,
        toolCalls: [{ id: 'call-x', name: 'missing', argumentsJson: '{}' }],
      },
      finalTurn('工具不可用，我直接回答。'),
    ]);
    const agent = new Agent({
      provider,
      tools: [calculatorTool],
      maxSteps: 3,
    });

    const result = await agent.run('调用一个不存在的工具');

    expect(result.content).toContain('直接回答');
    expect(toolContents(provider.calls[1]?.messages ?? [])).toEqual([
      '{"error":"未知工具：missing"}',
    ]);
  });

  it('非法 JSON 与不符合 schema 的参数都会回填为工具错误', async () => {
    const provider = new ScriptedProvider([
      {
        content: null,
        toolCalls: [
          {
            id: 'bad-json',
            name: 'calculator',
            argumentsJson: '{"expression":',
          },
          {
            id: 'bad-schema',
            name: 'calculator',
            argumentsJson: '{"expression":""}',
          },
        ],
      },
      finalTurn('参数有问题。'),
    ]);
    const agent = new Agent({
      provider,
      tools: [calculatorTool],
      maxSteps: 3,
    });

    await agent.run('测试错误参数');

    const contents = toolContents(provider.calls[1]?.messages ?? []);
    expect(contents[0]).toContain('工具参数不是合法 JSON');
    expect(contents[1]).toContain('参数校验失败');
  });

  it('超过最大轮数时抛出 AgentMaxStepsError', async () => {
    const provider = new ScriptedProvider(
      Array.from({ length: 5 }, (_, index) =>
        calculatorTurn(`call-${index}`, '1 + 1'),
      ),
    );
    const agent = new Agent({
      provider,
      tools: [calculatorTool],
      maxSteps: 2,
    });

    await expect(agent.run('无限调用工具')).rejects.toBeInstanceOf(
      AgentMaxStepsError,
    );
    expect(provider.calls).toHaveLength(2);
  });

  it('保留多轮对话上下文，reset 后清空', async () => {
    const provider = new ScriptedProvider([
      finalTurn('第一轮'),
      finalTurn('第二轮'),
    ]);
    const agent = new Agent({
      provider,
      systemPrompt: 'system',
      maxSteps: 2,
    });

    await agent.run('第一问');
    await agent.run('第二问');

    expect(provider.calls[1]?.messages).toEqual([
      { role: 'system', content: 'system' },
      { role: 'user', content: '第一问' },
      { role: 'assistant', content: '第一轮' },
      { role: 'user', content: '第二问' },
    ]);

    agent.reset();
    expect(agent.getMessages()).toEqual([
      { role: 'system', content: 'system' },
    ]);
  });

  it('拒绝空输入与重复工具名', async () => {
    const provider = new ScriptedProvider([finalTurn('不会走到这里')]);
    const agent = new Agent({ provider });
    await expect(agent.run('   ')).rejects.toThrowError('输入不能为空');

    expect(
      () =>
        new Agent({
          provider,
          tools: [calculatorTool, calculatorTool],
        }),
    ).toThrowError('工具名称重复');
  });
});
