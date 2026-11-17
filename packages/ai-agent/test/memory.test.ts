import { describe, expect, it } from 'vitest';
import { trimHistory } from '../src/agent/memory.js';
import type { ProviderMessage } from '../src/providers/types.js';

const system: ProviderMessage = { role: 'system', content: 'system' };
const user1: ProviderMessage = { role: 'user', content: 'u1' };
const assistant1: ProviderMessage = { role: 'assistant', content: 'a1' };
const user2: ProviderMessage = { role: 'user', content: 'u2' };
const assistant2: ProviderMessage = { role: 'assistant', content: 'a2' };

describe('trimHistory', () => {
  it('保留 system，并从最近的 user 边界截断', () => {
    const messages = [system, user1, assistant1, user2, assistant2];

    expect(trimHistory(messages, 3)).toEqual([system, user2, assistant2]);
  });

  it('预算窗口落在工具调用中间时，向前退到 user', () => {
    const messages: ProviderMessage[] = [
      system,
      user1,
      {
        role: 'assistant',
        content: null,
        toolCalls: [{ id: 'call-1', name: 'calculator', argumentsJson: '{}' }],
      },
      { role: 'tool', toolCallId: 'call-1', content: '{"result":1}' },
      assistant2,
    ];

    const trimmed = trimHistory(messages, 2);

    expect(trimmed[0]).toEqual(system);
    expect(trimmed[1]).toEqual(user1);
    expect(trimmed.at(-1)).toEqual(assistant2);
  });

  it('消息数未超限时原样返回副本', () => {
    const messages = [system, user1, assistant1];
    const trimmed = trimHistory(messages, 10);

    expect(trimmed).toEqual(messages);
    expect(trimmed).not.toBe(messages);
  });
});
