import { open, stat, unlink } from 'node:fs/promises';
import { setTimeout as sleep } from 'node:timers/promises';

/**
 * 企业级练习：基于锁文件的互斥执行
 *
 * 场景：多实例定时任务、部署脚本、批处理只允许一个进程执行。
 * 通过创建锁文件实现单机互斥，比 Redis/数据库锁更轻量，但仅适用于
 * 单机文件系统；NFS/多节点场景应使用分布式锁。
 *
 * 函数签名
 *   withFileLock<T>(lockPath: string, fn: () => Promise<T>,
 *                   options?: FileLockOptions): Promise<T>
 *   - lockPath：锁文件路径
 *   - fn：受锁保护的任务，返回值即为 withFileLock 的返回值
 *   - options.timeoutMs：获取锁总超时，默认 5000；>= 0，否则抛 RangeError
 *   - options.retryMs：重试间隔，默认 25；> 0，否则抛 RangeError
 *   - options.staleMs：锁过期阈值，默认 30000；>= 0，否则抛 RangeError
 *
 * 示例
 *   await withFileLock('/tmp/job.lock', async () => {
 *     // 此时锁文件存在，其他进程会被阻塞
 *     return 'done'
 *   })
 *   // fn 返回后锁文件已删除
 *
 *   // 已有锁且不超时
 *   await withFileLock('/tmp/job.lock', async () => 'never', { timeoutMs: 30 })
 *   => 抛 LockTimeoutError，锁文件保留
 *
 *   // 锁文件 mtime 超过 staleMs（残留锁）
 *   await withFileLock('/tmp/job.lock', async () => 'ok', { staleMs: 1000 })
 *   => 自动删除残留锁后获取，返回 'ok'
 *
 * 要求
 *   1. 使用 open(lockPath, 'wx') 原子创建锁文件；EEXIST 时重试，非 EEXIST 直接抛；
 *   2. 重试间隔为 retryMs，累计等待超过 timeoutMs 后抛 LockTimeoutError（保留他人锁）；
 *   3. 已有锁的 mtime 超过 staleMs 时视为残留锁，删除后重试；
 *   4. 锁文件内容写入 JSON：{ pid, createdAt }，便于排查；
 *   5. fn 成功或失败都必须删除锁文件（finally 中 close handle + unlink）；
 *   6. timeoutMs/staleMs >= 0、retryMs > 0，否则抛 RangeError。
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
