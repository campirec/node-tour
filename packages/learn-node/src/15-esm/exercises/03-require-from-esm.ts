import { createRequire } from 'node:module';

/**
 * 练习 3：在 ESM 中加载 CommonJS 模块
 *
 * 场景：项目使用 ESM，但依赖仍是 CJS 包、需要读取 JSON 配置文件，或使用
 * 只能在 CJS 中工作的旧库。createRequire 提供了从 ESM 调用 require 的互操作。
 *
 * 函数签名
 *   requireFromEsm<T = unknown>(metaUrl: string, request: string): T
 *   - metaUrl：当前模块的 import.meta.url，用于定位 require 的基准路径
 *   - request：模块标识符，可以是内置模块名、绝对路径或包名
 *   - 返回：require(request) 的结果，泛型 T 由调用方指定
 *
 * 示例
 *   requireFromEsm<typeof import('node:path')>(import.meta.url, 'node:path')
 *   => path 模块（path.join 可用）
 *
 *   requireFromEsm<{ answer: number }>(metaUrl, '/path/to/legacy.cjs')
 *   => { answer: 42 }
 *
 * 要求
 *   1. 使用 node:module 的 createRequire(metaUrl) 创建 require 函数；
 *   2. request 支持内置模块（如 'node:path'）、绝对路径和包名；
 *   3. 返回 require 的执行结果并保留泛型 T；
 *   4. require 本身的错误（模块不存在、语法错误等）向上传播，不额外包装。
 *
 * 提示：createRequire 得到的是 CommonJS 加载器，不适用于 ESM-only 包。
 */
export function requireFromEsm<T = unknown>(
  metaUrl: string,
  request: string,
): T {
  // TODO
  throw new Error('TODO: requireFromEsm');
}
