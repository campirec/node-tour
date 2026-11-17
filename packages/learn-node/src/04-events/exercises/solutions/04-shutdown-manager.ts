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

interface RegisteredHook {
  name: string;
  hook: ShutdownHook;
}

export function createShutdownManager(
  options: ShutdownManagerOptions = {},
): ShutdownManager {
  const timeoutMs = options.timeoutMs ?? 5000;
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) {
    throw new RangeError('timeoutMs 必须是正数');
  }

  const hooks: RegisteredHook[] = [];
  let shuttingDown = false;
  let shutdownPromise: Promise<void> | undefined;

  const register = (name: string, hook: ShutdownHook): (() => void) => {
    if (!name || typeof hook !== 'function') {
      throw new TypeError('name 不能为空且 hook 必须是函数');
    }
    if (shuttingDown) {
      throw new Error('正在关闭，不能注册新的钩子');
    }
    if (hooks.some((entry) => entry.name === name)) {
      throw new Error(`钩子名称重复：${name}`);
    }

    const entry: RegisteredHook = { name, hook };
    hooks.push(entry);

    return (): void => {
      const index = hooks.indexOf(entry);
      if (index !== -1) {
        hooks.splice(index, 1);
      }
    };
  };

  const run = async (reason: string): Promise<void> => {
    const errors: unknown[] = [];

    for (const { name, hook } of [...hooks].reverse()) {
      try {
        await withTimeout(Promise.resolve().then(() => hook(reason)), timeoutMs, name);
      } catch (error) {
        errors.push(error);
        options.onError?.(error, name);
      }
    }

    if (errors.length > 0) {
      throw new AggregateError(
        errors,
        `关闭过程中 ${errors.length} 个钩子失败`,
      );
    }
  };

  return {
    register,
    shutdown(reason = 'manual'): Promise<void> {
      if (!shutdownPromise) {
        shuttingDown = true;
        shutdownPromise = run(reason);
      }
      return shutdownPromise;
    },
    isShuttingDown(): boolean {
      return shuttingDown;
    },
    hookCount(): number {
      return hooks.length;
    },
  };
}

function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  name: string,
): Promise<T> {
  let timer: NodeJS.Timeout | undefined;

  const timeout = new Promise<never>((_resolve, reject) => {
    timer = setTimeout(() => {
      reject(new ShutdownTimeoutError(name, timeoutMs));
    }, timeoutMs);
    timer.unref();
  });

  return Promise.race([promise, timeout]).finally(() => {
    if (timer) {
      clearTimeout(timer);
    }
  });
}
