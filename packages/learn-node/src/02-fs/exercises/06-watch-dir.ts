import { watch } from 'node:fs';
import type { FSWatcher } from 'node:fs';

/**
 * 企业级练习：封装 fs.watch 为可控的文件变化订阅
 *
 * 场景：配置文件热更新、上传目录监控、构建缓存失效。
 * fs.watch 是底层能力，存在跨平台差异、重复触发、事件名不可靠等问题；
 * 生产项目通常用 chokidar，但理解原始 API 有助于排查这些问题。
 *
 * 函数签名
 *   watchDir(dir: string, options?: WatchDirOptions): FileWatchHandle
 *   - dir：要监听的目录
 *   - options.onError：监听器抛错或 watcher 自身报错时的回调
 *   - 返回：FileWatchHandle，含 onChange 与 dispose 方法
 *
 *   FileWatchHandle.onChange(listener): () => void
 *   - listener 收到 { eventType, filename }；返回值为注销函数
 *
 *   FileWatchHandle.dispose(): Promise<void>
 *   - 关闭 watcher 并清空所有监听器，幂等可重复调用
 *
 * 示例
 *   const handle = watchDir('/uploads', { onError: console.error })
 *   const off = handle.onChange(({ eventType, filename }) => {
 *     console.log(eventType, filename)  // 'rename', 'a.txt'
 *   })
 *   // ... 文件变化时触发回调 ...
 *   off()           // 注销单个监听器
 *   await handle.dispose()  // 关闭并清空，可重复调用
 *
 * 要求
 *   1. 使用 fs.watch 监听 dir，返回 { dispose, onChange }；
 *   2. onChange 注册监听器，监听器收到 { eventType, filename }；
 *   3. filename 统一使用正斜杠（将 '\\' 替换为 '/'），无 filename 时为空串；
 *   4. onChange 返回注销函数，调用后该监听器不再被触发；
 *   5. dispose 关闭 watcher 并移除所有监听器，幂等可重复调用；
 *   6. 监听器抛错时通过 onError 回调上报，不中断其他监听器的执行。
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
