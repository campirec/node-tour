export type LazyModule<T> = (() => Promise<T>) & {
  reset(): void;
};

export function createLazyModule<T>(
  loader: () => Promise<T>,
): LazyModule<T> {
  if (typeof loader !== 'function') {
    throw new TypeError('loader 必须是函数');
  }

  let cached: Promise<T> | undefined;

  const lazy = ((): Promise<T> => {
    if (!cached) {
      cached = loader().catch((error: unknown) => {
        cached = undefined;
        throw error;
      });
    }
    return cached;
  }) as LazyModule<T>;

  lazy.reset = (): void => {
    cached = undefined;
  };

  return lazy;
}
