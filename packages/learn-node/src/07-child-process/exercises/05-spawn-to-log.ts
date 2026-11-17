/**
 * 企业级练习：把子进程输出持续写入日志文件。
 *
 * 场景：部署脚本、构建任务、数据迁移。输出可能很大，不能全部缓存在内存；
 * 失败后需要保留完整日志供排查。
 *
 * 要求：
 * - 自动创建日志目录；
 * - stdout 与 stderr 合并写入 logPath；
 * - 非零退出码不抛错，返回实际 exitCode（由调用方决定是否失败）；
 * - timeoutMs 到期终止进程并拒绝；
 * - 子进程启动失败、日志写入失败要拒绝；
 * - 进程结束且日志 flush 后才 resolve。
 */
export interface RunToLogOptions {
  logPath: string;
  timeoutMs?: number;
  cwd?: string;
}

export interface RunToLogResult {
  exitCode: number;
  logPath: string;
}

export async function runToLog(
  file: string,
  args: readonly string[],
  options: RunToLogOptions,
): Promise<RunToLogResult> {
  // TODO
  throw new Error('TODO: runToLog');
}
