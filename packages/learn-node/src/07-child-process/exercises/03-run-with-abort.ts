import { spawn } from 'node:child_process';

/**
 * 练习 3：支持 AbortSignal 的子进程。
 *
 * 场景：请求超时、服务关闭、用户取消长任务时，必须终止子进程，避免僵尸进程。
 *
 * 要求：
 * - signal 已经中止时立即拒绝，不启动子进程；
 * - 中止后 kill 子进程，并以“命令已取消”拒绝；
 * - 正常退出返回 { stdout, stderr }；非零退出拒绝并包含 stderr；
 * - 清理 abort 监听器与兜底定时器，避免进程无法退出。
 */
export interface AbortableResult {
  stdout: string;
  stderr: string;
}

export async function runWithAbort(
  file: string,
  args: readonly string[],
  signal: AbortSignal,
): Promise<AbortableResult> {
  // TODO: spawn -> signal.addEventListener('abort') -> child.kill()
  throw new Error('TODO: runWithAbort');
}
