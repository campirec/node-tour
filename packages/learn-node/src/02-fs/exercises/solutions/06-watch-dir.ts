import { watch } from 'node:fs';
import type { FSWatcher } from 'node:fs';

export interface FileChange {
  eventType: 'rename' | 'change';
  filename: string;
}

export interface FileWatchHandle {
  onChange(listener: (change: FileChange) => void): () => void;
  dispose(): Promise<void>;
}

export interface WatchDirOptions {
  onError?: (error: unknown) => void;
}

export function watchDir(
  dir: string,
  options: WatchDirOptions = {},
): FileWatchHandle {
  const listeners = new Set<(change: FileChange) => void>();
  let disposed = false;
  const watcher: FSWatcher = watch(dir, (eventType, filename) => {
    if (disposed) return;
    const change: FileChange = {
      eventType,
      filename: filename ? filename.toString().replace(/\\/g, '/') : '',
    };
    for (const listener of listeners) {
      try {
        listener(change);
      } catch (error) {
        options.onError?.(error);
      }
    }
  });

  watcher.on('error', (error) => {
    options.onError?.(error);
  });

  return {
    onChange(listener): () => void {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    dispose(): Promise<void> {
      if (disposed) return Promise.resolve();
      disposed = true;
      listeners.clear();
      return new Promise<void>((resolve) => {
        watcher.close();
        // fs.watch close 是同步的，resolve 在下一 tick 确保清理完成
        setImmediate(resolve);
      });
    },
  };
}
