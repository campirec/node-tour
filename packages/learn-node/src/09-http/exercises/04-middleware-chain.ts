/**
 * 企业级练习：实现 Koa 风格中间件链
 *
 * 场景：鉴权、请求日志、限流、错误处理、响应包装都适合放在中间件里，
 * 通过洋葱模型让 next() 前后逻辑分别包裹下游。
 *
 * 函数签名
 *   composeMiddleware(middlewares: readonly Middleware[]): (context) => Promise<MiddlewareContext>
 *   - middlewares：中间件数组，按注册顺序执行
 *   - context：{ method, url, status, body?, state }，初始 status 通常为 404
 *   - 返回：执行完毕后的 context（同一个引用，中间件可修改 status/body）
 *
 * 示例
 *   composeMiddleware([
 *     async (ctx, next) => { ctx.state.userId = 'u1'; await next(); },
 *     async (ctx) => { ctx.status = 200; ctx.body = { userId: ctx.state.userId }; },
 *   ])(ctx)
 *   => ctx.status = 200, ctx.body = { userId: 'u1' }
 *
 *   composeMiddleware([
 *     async (_ctx, next) => { await next(); await next(); },
 *   ])(ctx)
 *   => 抛 Error（包含 'next()'）
 *
 * 要求
 *   1. 中间件按注册顺序执行，next() 调用下一个；不调用 next() 即短路后续中间件；
 *   2. 同一个中间件重复调用 next() 时抛错（错误消息包含 'next()'）；
 *   3. 支持异步中间件，next() 前后的代码形成洋葱模型
 *      （执行顺序：A before → B before → handler → B after → A after）；
 *   4. ctx.state 用于中间件之间传递请求级数据；
 *   5. 没有中间件写响应时，status 保持 context 传入时的默认值（404）；
 *   6. 内层中间件抛出的异常向外层传播，可被外层 try/catch 捕获。
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
