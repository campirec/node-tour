export interface MiddlewareContext {
  method: string;
  url: URL;
  status: number;
  body?: unknown;
  state: Record<string, unknown>;
}

export type Middleware = (
  context: MiddlewareContext,
  next: () => Promise<void>,
) => Promise<void> | void;

export function composeMiddleware(
  middlewares: readonly Middleware[],
): (context: MiddlewareContext) => Promise<MiddlewareContext> {
  return async (context: MiddlewareContext): Promise<MiddlewareContext> => {
    const dispatch = async (index: number): Promise<void> => {
      if (index >= middlewares.length) {
        return;
      }

      const middleware = middlewares[index] as Middleware;
      let called = false;
      const next = async (): Promise<void> => {
        if (called) {
          throw new Error('同一个中间件不能重复调用 next()');
        }
        called = true;
        await dispatch(index + 1);
      };

      await middleware(context, next);
    };

    await dispatch(0);
    return context;
  };
}
