import type { EventEmitter } from 'node:events';

export function forwardEvents(
  source: EventEmitter,
  target: EventEmitter,
  events: readonly string[],
): () => void {
  const listeners = new Map<string, (...args: unknown[]) => void>();

  for (const event of new Set(events)) {
    const listener = (...args: unknown[]): void => {
      target.emit(event, ...args);
    };
    listeners.set(event, listener);
    source.on(event, listener);
  }

  let disposed = false;
  return (): void => {
    if (disposed) {
      return;
    }
    disposed = true;
    for (const [event, listener] of listeners) {
      source.off(event, listener);
    }
    listeners.clear();
  };
}
