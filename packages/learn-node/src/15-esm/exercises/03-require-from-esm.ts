import { createRequire } from 'node:module';

/**
 * 练习 3：在 ESM 中加载 CommonJS。
 *
 * 场景：依赖仍是 CJS 包、读取 JSON、使用只能在 CJS 中工作的旧库。
 *
 * 要求：
 * - 使用 node:module 的 createRequire(metaUrl)；
 * - request 可以是内置模块、绝对路径或包名；
 * - 返回 require 的结果并保留泛型。
 *
 * 注意：createRequire 得到的是 CommonJS 加载器，不适用于 ESM-only 包。
 * ESM 文件应优先使用 import；createRequire 是互操作逃生舱。
 */
export function requireFromEsm<T = unknown>(
  metaUrl: string,
  request: string,
): T {
  // TODO
  throw new Error('TODO: requireFromEsm');
}
