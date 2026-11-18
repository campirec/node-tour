import { spawn } from 'node:child_process';

/**
 * 练习 3：支持 AbortSignal 的子进程执行
 *
 * 场景：请求超时、服务关闭、用户取消长任务时，必须终止子进程，避免僵尸进程
 * 占用资源。通过 AbortSignal 可以与 fetch、事件等统一的取消机制协作。
 *
 * 函数签名
 *   runWithAbort(file: string, args: readonly string[], signal: AbortSignal): Promise<AbortableResult>
 *   - file：可执行文件路径
 *   - args：参数数组
 *   - signal：AbortSignal，中止时终止子进程
 *   - 返回：{ stdout, stderr }，均为 UTF-8 字符串
 *
 * 示例
 *   const controller = new AbortController();
 *   runWithAbort(process.execPath, ['-e', 'console.log("ok")'], controller.signal)
 *   => { stdout: 'ok\n', stderr: '' }
 *
 *   const controller = new AbortController();
 *   const p = runWithAbort(process.execPath, [fixture('sleep.mjs')], controller.signal);
 *   setTimeout(() => controller.abort(), 30);
 *   // => 抛 Error('命令已取消')
 *
 * 要求
 *   1. signal 已经中止时立即抛 Error('命令已取消')，不启动子进程；
 *   2. signal 中止后 kill 子进程（先 SIGTERM，兜底 SIGKILL），并抛 Error('命令已取消')；
 *   3. 正常退出（code === 0）时返回 { stdout, stderr }；
 *   4. 非零退出码时 reject，错误信息包含 stderr；
 *   5. 清理 abort 事件监听器与兜底定时器，避免进程无法退出。
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
