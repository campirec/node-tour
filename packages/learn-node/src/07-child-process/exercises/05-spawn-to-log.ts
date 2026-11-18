/**
 * 企业级练习：把子进程输出持续写入日志文件
 *
 * 场景：部署脚本、构建任务、数据迁移。输出可能很大，不能全部缓存在内存；
 * 失败后需要保留完整日志供排查。stdout 与 stderr 合并写入文件，非零退出码
 * 不抛错，由调用方根据 exitCode 决定后续逻辑。
 *
 * 函数签名
 *   runToLog(file: string, args: readonly string[], options: RunToLogOptions): Promise<RunToLogResult>
 *   - file：可执行文件路径
 *   - args：参数数组
 *   - options.logPath：日志文件路径，所在目录不存在时自动创建
 *   - options.timeoutMs：可选，到期终止子进程并拒绝
 *   - options.cwd：可选工作目录
 *   - 返回：{ exitCode, logPath }
 *
 * 示例
 *   await runToLog(process.execPath, [fixture('print-lines.mjs')], { logPath: '/tmp/logs/deploy.log' })
 *   => { exitCode: 0, logPath: '/tmp/logs/deploy.log' }
 *
 *   await runToLog(process.execPath, [fixture('fail.mjs')], { logPath: '/tmp/fail.log' })
 *   => { exitCode: 3, logPath: '/tmp/fail.log' }（日志中包含 'boom'）
 *
 * 要求
 *   1. 自动递归创建 logPath 的父目录；
 *   2. stdout 与 stderr 合并写入 logPath（使用 pipe + { end: false }）；
 *   3. 非零退出码不抛错，返回实际 exitCode；
 *   4. timeoutMs 到期时终止子进程，抛包含 '超时' 的 Error；
 *   5. 子进程启动失败（如 ENOENT）时 reject，错误带 code 属性；
 *   6. 日志文件写入失败时 reject；
 *   7. 必须等日志流 flush 完成后才 resolve 或 reject；
 *   8. logPath 为空串时抛 RangeError；timeoutMs 非正数时抛 RangeError。
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
