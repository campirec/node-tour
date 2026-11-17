/**
 * 企业级练习：解析配置中的容量与时长。
 *
 * 场景：MAX_UPLOAD=10MB、REQUEST_TIMEOUT=30s、CACHE_TTL=1h。
 * 这些值来自环境变量，必须转成数字并在启动时失败，而不是运行到一半才报错。
 *
 * 要求：
 * - 支持 B/KB/MB/GB/TB（1024 进制，大小写不敏感，允许空格）；
 * - 时长支持 ms/s/m/h/d，省略单位时：容量按 B，时长按 ms；
 * - 允许小数，结果向下取整；
 * - 空字符串、负数、未知单位、溢出安全整数时抛 RangeError。
 */
export function parseByteSize(input: string): number {
  // TODO
  throw new Error('TODO: parseByteSize');
}

export function parseDuration(input: string): number {
  // TODO
  throw new Error('TODO: parseDuration');
}
