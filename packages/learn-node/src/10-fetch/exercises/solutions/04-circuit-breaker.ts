export class CircuitOpenError extends Error {
  readonly retryAfterMs: number;

  constructor(retryAfterMs: number) {
    super(`熔断器已打开，请在 ${retryAfterMs}ms 后重试`);
    this.name = 'CircuitOpenError';
    this.retryAfterMs = retryAfterMs;
  }
}

export type CircuitState = 'closed' | 'open' | 'half-open';

export interface CircuitBreakerOptions {
  failureThreshold?: number;
  cooldownMs?: number;
  now?: () => number;
}

export interface CircuitBreaker {
  execute<T>(action: () => Promise<T>): Promise<T>;
  state(): CircuitState;
  reset(): void;
}

export function createCircuitBreaker(
  options: CircuitBreakerOptions = {},
): CircuitBreaker {
  const failureThreshold = options.failureThreshold ?? 5;
  const cooldownMs = options.cooldownMs ?? 30_000;
  const now = options.now ?? Date.now;

  if (!Number.isInteger(failureThreshold) || failureThreshold < 1) {
    throw new RangeError('failureThreshold 必须是正整数');
  }
  if (!Number.isFinite(cooldownMs) || cooldownMs <= 0) {
    throw new RangeError('cooldownMs 必须是正数');
  }

  let currentState: CircuitState = 'closed';
  let failures = 0;
  let openedAt = 0;
  let halfOpenInFlight = false;

  const reset = (): void => {
    currentState = 'closed';
    failures = 0;
    openedAt = 0;
    halfOpenInFlight = false;
  };

  return {
    async execute<T>(action: () => Promise<T>): Promise<T> {
      if (currentState === 'open') {
        const elapsed = now() - openedAt;
        if (elapsed < cooldownMs) {
          throw new CircuitOpenError(cooldownMs - elapsed);
        }
        currentState = 'half-open';
        halfOpenInFlight = false;
      }

      if (currentState === 'half-open') {
        if (halfOpenInFlight) {
          throw new CircuitOpenError(cooldownMs);
        }
        halfOpenInFlight = true;
      }

      try {
        const result = await action();
        reset();
        return result;
      } catch (error) {
        halfOpenInFlight = false;
        failures += 1;

        if (currentState === 'half-open' || failures >= failureThreshold) {
          currentState = 'open';
          openedAt = now();
        }
        throw error;
      }
    },

    state(): CircuitState {
      return currentState;
    },

    reset,
  };
}
