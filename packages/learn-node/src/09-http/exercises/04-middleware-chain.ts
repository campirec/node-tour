/**
 * 企业级练习：实现 Koa 风格中间件链。
 *
 * 场景：鉴权、请求日志、限流、错误处理、响应包装，都适合放在中间件里。
 *
 * 要求：
 * - 中间件按注册顺序执行，next() 调用下一个；
 * - 不调用 next() 即短路，后续中间件不执行；
 * - 同一个中间件重复调用 next() 抛错；
 * - 支持异步中间件，next() 前后的代码形成“洋葱模型”；
 * - ctx.state 用于中间件之间传递请求级数据；
 * - 没有中间件写响应时，status 保持默认 404。
 */
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
  // TODO
  throw new Error('TODO: composeMiddleware');
}
