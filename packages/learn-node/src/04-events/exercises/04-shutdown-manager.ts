/**
 * 企业级练习：优雅关闭管理器。
 *
 * 场景：收到 SIGTERM 后按逆序关闭 HTTP server、队列消费者、数据库连接；
 * 每个钩子有超时；单个钩子失败不能阻止其他资源释放。
 *
 * 要求：
 * - register(name, hook) 返回注销函数；名称不能重复；
 * - shutdown(reason) 幂等，返回同一个 Promise；
 * - 钩子按注册的逆序执行（LIFO），并收到 reason；
 * - 每个钩子超过 timeoutMs 抛 ShutdownTimeoutError，但继续执行后续钩子；
 * - 任一钩子失败时，等所有钩子执行完再抛 AggregateError；
 * - 关闭开始后禁止注册新钩子。
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
