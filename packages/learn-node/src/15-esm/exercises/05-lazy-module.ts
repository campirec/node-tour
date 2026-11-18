/**
 * 企业级练习：惰性单例模块加载器
 *
 * 场景：数据库客户端、SDK、重型路由模块在首次使用时才初始化；并发请求
 * 同时触发初始化时只能执行一次 loader，避免重复开销。
 *
 * 函数签名
 *   createLazyModule<T>(loader: () => Promise<T>): LazyModule<T>
 *   - loader：返回 Promise<T> 的初始化函数
 *   - 返回：一个函数，调用它返回 Promise<T>；附带 reset() 方法
 *   - LazyModule<T> = (() => Promise<T>) & { reset(): void }
 *
 * 示例
 *   const lazy = createLazyModule(async () => 'ready');
 *   lazy()  => Promise<'ready'>（首次调用执行 loader）
 *   lazy()  => 同一个 Promise（不重复执行）
 *   lazy.reset()  => 下次调用重新执行 loader
 *
 * 要求
 *   1. 首次调用执行 loader，之后返回同一个 Promise；并发调用只执行一次 loader；
 *   2. 成功结果永久缓存，后续调用返回同一个已 resolve 的 Promise；
 *   3. loader 失败后清空缓存，下一次调用重新执行 loader 可重试；
 *   4. reset() 清空缓存，强制下次调用重新加载；
 *   5. loader 不是函数时抛 TypeError。
 */
export type LazyModule<T> = (() => Promise<T>) & {
  reset(): void;
};

export function createLazyModule<T>(
  loader: () => Promise<T>,
): LazyModule<T> {
  // TODO
  throw new Error('TODO: createLazyModule');
}
