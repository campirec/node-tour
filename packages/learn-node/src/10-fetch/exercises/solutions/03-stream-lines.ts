export async function* streamLines(
  url: string,
  signal?: AbortSignal,
): AsyncGenerator<string> {
  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  if (!response.body) {
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      buffer += decoder.decode(value, { stream: true });

      let index = buffer.indexOf('\n');
      while (index !== -1) {
        yield buffer.slice(0, index).replace(/\r$/, '');
        buffer = buffer.slice(index + 1);
        index = buffer.indexOf('\n');
      }
    }
  } finally {
    reader.releaseLock();
  }

  buffer += decoder.decode();
  if (buffer.length > 0) {
    yield buffer.replace(/\r$/, '');
  }
}
