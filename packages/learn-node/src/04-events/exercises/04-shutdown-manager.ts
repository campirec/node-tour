/**
 * 企业级练习：优雅关闭管理器
 *
 * 场景：收到 SIGTERM 后按逆序关闭 HTTP server、队列消费者、数据库连接；
 * 每个钩子有超时；单个钩子失败不能阻止其他资源释放。
 *
 * 函数签名
 *   createShutdownManager(options?: ShutdownManagerOptions): ShutdownManager
 *   - options.timeoutMs：每个钩子的超时，默认 5000；必须是正数，否则抛 RangeError
 *   - options.onError：钩子失败/超时时的回调 (error, name) => void
 *
 *   ShutdownManager.register(name: string, hook: ShutdownHook): () => void
 *   - name：钩子名称，不能重复，不能为空；hook 必须是函数
 *   - 返回注销函数，调用后该钩子不再参与 shutdown
 *
 *   ShutdownManager.shutdown(reason?: string): Promise<void>
 *   - 幂等：重复调用返回同一个 Promise
 *
 *   ShutdownManager.isShuttingDown(): boolean
 *   ShutdownManager.hookCount(): number
 *
 * 示例
 *   const mgr = createShutdownManager()
 *   mgr.register('db', (reason) => console.log(`db:${reason}`))
 *   mgr.register('http', async (reason) => console.log(`http:${reason}`))
 *   await mgr.shutdown('SIGTERM')
 *   // 输出顺序：http:SIGTERM, db:SIGTERM（LIFO）
 *
 *   const p1 = mgr.shutdown(); const p2 = mgr.shutdown()
 *   // p1 === p2，钩子只执行一次
 *
 * 要求
 *   1. register(name, hook) 返回注销函数；name 不能为空、不能重复，hook 必须是函数，
 *      否则抛 TypeError / Error；
 *   2. shutdown(reason?) 幂等，重复调用返回同一个 Promise，钩子只执行一次；
 *   3. 钩子按注册的逆序执行（LIFO），并收到 reason（默认 'manual'）；
 *   4. 每个钩子超过 timeoutMs 抛 ShutdownTimeoutError，但继续执行后续钩子；
 *   5. 任一钩子失败（含超时）时，每个失败的错误通过 onError 上报，
 *      等所有钩子执行完后抛 AggregateError（含全部错误）；
 *   6. shutdown 开始后禁止注册新钩子，调用 register 抛 Error('正在关闭…')；
 *   7. timeoutMs 必须是正数，否则抛 RangeError。
 */
export class ShutdownTimeoutError extends Error {
  constructor(name: string, timeoutMs: number) {
    super(`关闭钩子 ${name} 超时（${timeoutMs}ms）`);
    this.name = 'ShutdownTimeoutError';
  }
}

export interface ShutdownManagerOptions {
  timeoutMs?: number;
  onError?: (error: unknown, name: string) => void;
}

export type ShutdownHook = (reason: string) => void | Promise<void>;

export interface ShutdownManager {
  register(name: string, hook: ShutdownHook): () => void;
  shutdown(reason?: string): Promise<void>;
  isShuttingDown(): boolean;
  hookCount(): number;
}

export function createShutdownManager(
  options: ShutdownManagerOptions = {},
): ShutdownManager {
  // TODO
  throw new Error('TODO: createShutdownManager');
}
