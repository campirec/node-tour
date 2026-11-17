/**
 * 企业级练习：惰性单例模块加载器。
 *
 * 场景：数据库客户端、SDK、重型路由模块在首次使用时才初始化；
 * 并发请求同时触发初始化时只能执行一次。
 *
 * 要求：
 * - 第一次调用执行 loader，之后返回同一个 Promise；
 * - 成功结果永久缓存；
 * - 失败后清空缓存，下一次调用可以重试；
 * - reset() 强制下一次重新加载；
 * - loader 不是函数时抛 TypeError。
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
