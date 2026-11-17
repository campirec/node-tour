import type { ProviderMessage } from '../providers/types.js';

/**
 * 从最近的 user 消息处截断，避免把 assistant.tool_calls 与其后的 tool 结果拆散。
 * system 消息永远保留。
 */
export function trimHistory(
  messages: readonly ProviderMessage[],
  maxMessages: number,
): ProviderMessage[] {
  if (maxMessages < 1 || messages.length <= maxMessages) {
    return [...messages];
  }

  const systemMessages = messages.filter((message) => message.role === 'system');
  const conversation = messages.filter((message) => message.role !== 'system');
  const keep = Math.max(1, maxMessages - systemMessages.length);

  let start = Math.max(0, conversation.length - keep);
  if (conversation[start]?.role !== 'user') {
    const nextUser = conversation.findIndex(
      (message, index) => index >= start && message.role === 'user',
    );
    if (nextUser !== -1) {
      start = nextUser;
    } else {
      // 最近的窗口内没有 user：回退到最后一个 user，宁可超出预算也不拆散工具调用。
      const lastUser = conversation.findLastIndex(
        (message) => message.role === 'user',
      );
      if (lastUser !== -1) {
        start = lastUser;
      }
    }
  }

  // 没有 user 的异常输入：至少不要以孤立的 tool 结果开头。
  while (start < conversation.length && conversation[start]?.role === 'tool') {
    start += 1;
  }

  return [...systemMessages, ...conversation.slice(start)];
}
