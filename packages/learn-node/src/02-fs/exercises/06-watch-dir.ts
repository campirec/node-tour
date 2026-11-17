import { watch } from 'node:fs';
import type { FSWatcher } from 'node:fs';

/**
 * 企业级练习：封装 fs.watch 为可控的文件变化订阅。
 *
 * 场景：配置文件热更新、上传目录监控、构建缓存失效。
 * fs.watch 是底层能力，存在跨平台差异、重复触发、事件名不可靠等问题；
 * 生产项目通常用 chokidar，但理解原始 API 有助于排查这些问题。
 *
 * 要求：
 * - 使用 fs.watch 监听 dir，返回 { dispose, onChange }；
 * - onChange 注册监听器，监听器收到 { eventType, filename }；
 * - dispose 关闭 watcher 并移除所有监听器，可重复调用；
 * - filename 统一使用正斜杠；
 * - 监听器抛错时通过 onError 回调上报，不中断其他监听器。
 */
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
  // TODO: fs.watch + 监听器集合 + dispose
  throw new Error('TODO: watchDir');
}
