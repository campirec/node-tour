import { open, stat, unlink } from 'node:fs/promises';
import { setTimeout as sleep } from 'node:timers/promises';

/**
 * 企业级练习：基于锁文件的互斥执行。
 *
 * 场景：多实例定时任务、部署脚本、批处理只允许一个进程执行。
 *
 * 要求：
 * - 使用 `open(lockPath, 'wx')` 原子创建锁文件；
 * - 已存在锁时重试，直到超时抛 LockTimeoutError；
 * - 锁文件 mtime 超过 staleMs 视为残留锁，删除后重试；
 * - fn 成功或失败都必须删除锁；
 * - 锁文件内容包含 pid 与创建时间，便于排查。
 *
 * 注意：单机文件系统语义；NFS/多节点场景应使用 Redis/数据库锁。
 */
export class LockTimeoutError extends Error {
  constructor(lockPath: string, timeoutMs: number) {
    super(`获取文件锁超时（${timeoutMs}ms）：${lockPath}`);
    this.name = 'LockTimeoutError';
  }
}

export interface FileLockOptions {
  timeoutMs?: number;
  retryMs?: number;
  staleMs?: number;
}

export async function withFileLock<T>(
  lockPath: string,
  fn: () => Promise<T>,
  options: FileLockOptions = {},
): Promise<T> {
  // TODO: 'wx' 创建 -> 重试/清理 stale -> finally 释放
  throw new Error('TODO: withFileLock');
}
