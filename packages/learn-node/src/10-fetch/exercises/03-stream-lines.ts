/**
 * 练习 3：流式读取 fetch 响应并按行解析
 *
 * 场景：SSE、NDJSON、大日志下载、LLM 流式输出——需要逐行消费响应体，
 * 不能一次性 response.text() 以免缓冲整个大响应。
 *
 * 函数签名
 *   streamLines(url: string, signal?: AbortSignal): AsyncGenerator<string>
 *   - url：目标地址
 *   - signal：可选 AbortSignal
 *   - 返回：异步生成器，每次 yield 一行文本（已去除行尾 \r 与 \n）
 *
 * 示例
 *   streamLines(`${baseUrl}/stream`)(响应体: '第一行\r\n第二行\n\n最后一行')
 *   => ['第一行', '第二行', '', '最后一行']
 *
 *   streamLines(`${baseUrl}/missing`)
 *   => 抛 Error('HTTP 404')
 *
 * 要求
 *   1. 非 2xx 响应抛 Error('HTTP ${status}')；
 *   2. 使用 response.body.getReader() 增量读取，不调用 response.text()；
 *   3. 使用 TextDecoder({ stream: true }) 处理跨 chunk 的多字节字符；
 *   4. 支持 \n 与 \r\n 行尾，yield 的行不含换行符；
 *   5. 空行保留（连续 \n 产生空字符串行）；
 *   6. 最后一段无换行符时也要 yield；
 *   7. reader 必须在 finally 中 releaseLock()。
 */
export async function* streamLines(
  url: string,
  signal?: AbortSignal,
): AsyncGenerator<string> {
  // TODO
  throw new Error('TODO: streamLines');
}
