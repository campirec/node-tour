export interface SseEvent {
  event?: string;
  data: string;
  id?: string;
  retry?: number;
}

export async function* parseSse(
  url: string,
  signal?: AbortSignal,
): AsyncGenerator<SseEvent> {
  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  if (!response.body) {
    throw new Error('响应缺少 body');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let currentEvent: Partial<SseEvent> = {};

  const flush = (): SseEvent | undefined => {
    if (currentEvent.data === undefined && !currentEvent.event && !currentEvent.id) {
      currentEvent = {};
      return undefined;
    }
    const result: SseEvent = {
      data: currentEvent.data ?? '',
      ...(currentEvent.event ? { event: currentEvent.event } : {}),
      ...(currentEvent.id ? { id: currentEvent.id } : {}),
      ...(currentEvent.retry !== undefined ? { retry: currentEvent.retry } : {}),
    };
    currentEvent = {};
    return result;
  };

  const processLine = (line: string): SseEvent | undefined => {
    if (line === '') {
      return flush();
    }
    if (line.startsWith(':')) {
      return undefined;
    }

    const colonIndex = line.indexOf(':');
    const field = colonIndex === -1 ? line : line.slice(0, colonIndex);
    const value = colonIndex === -1 ? '' : line.slice(colonIndex + 1).replace(/^ /, '');

    switch (field) {
      case 'event':
        currentEvent.event = value;
        break;
      case 'data':
        currentEvent.data = currentEvent.data
          ? `${currentEvent.data}\n${value}`
          : value;
        break;
      case 'id':
        currentEvent.id = value;
        break;
      case 'retry': {
        const parsed = Number(value);
        if (Number.isFinite(parsed)) {
          currentEvent.retry = parsed;
        }
        break;
      }
      default:
        break;
    }
    return undefined;
  };

  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      let index = buffer.indexOf('\n');
      while (index !== -1) {
        const line = buffer.slice(0, index).replace(/\r$/, '');
        buffer = buffer.slice(index + 1);
        const event = processLine(line);
        if (event) yield event;
        index = buffer.indexOf('\n');
      }
    }

    // 处理最后一行（无换行符）
    buffer += decoder.decode();
    if (buffer.length > 0) {
      const event = processLine(buffer.replace(/\r$/, ''));
      if (event) yield event;
    }
    //  flush 剩余
    const remaining = flush();
    if (remaining) yield remaining;
  } finally {
    reader.releaseLock();
  }
}
