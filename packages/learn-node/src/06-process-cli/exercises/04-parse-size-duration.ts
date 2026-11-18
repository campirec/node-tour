/**
 * 企业级练习：解析配置中的容量与时长
 *
 * 场景：MAX_UPLOAD=10MB、REQUEST_TIMEOUT=30s、CACHE_TTL=1h。这些值来自
 * 环境变量，必须在启动时转成数字并校验，而不是运行到一半才报错。
 *
 * 函数签名
 *   parseByteSize(input: string): number
 *   - input：容量字符串，如 '10MB'、'1.5 KB'、'512'
 *   - 返回：字节数（整数）
 *
 *   parseDuration(input: string): number
 *   - input：时长字符串，如 '30s'、'1.5m'、'250'
 *   - 返回：毫秒数（整数）
 *
 * 示例
 *   parseByteSize('512')        => 512
 *   parseByteSize('1.5 KB')     => 1536
 *   parseByteSize('10mb')       => 10485760
 *   parseByteSize('2GB')        => 2147483648
 *   parseByteSize('0B')         => 0
 *   parseByteSize('')           => 抛 RangeError
 *   parseByteSize('-1MB')       => 抛 RangeError
 *   parseByteSize('999999TB')   => 抛 RangeError（溢出）
 *
 *   parseDuration('250')        => 250
 *   parseDuration('30ms')       => 30
 *   parseDuration('2s')         => 2000
 *   parseDuration('1.5m')       => 90000
 *   parseDuration('2h')         => 7200000
 *   parseDuration('1d')         => 86400000
 *   parseDuration('s')          => 抛 RangeError
 *
 * 要求
 *   1. 容量支持 B/KB/MB/GB/TB（1024 进制），大小写不敏感，数字与单位间允许空格；
 *   2. 时长支持 ms/s/m/h/d；
 *   3. 省略单位时：容量按 B，时长按 ms；
 *   4. 允许小数，结果向下取整（Math.floor）；
 *   5. 空字符串、负数、未知单位、格式非法（如 '1.2.3MB'）时抛 RangeError；
 *   6. 结果溢出 Number.MAX_SAFE_INTEGER 时抛 RangeError。
 */
export function parseByteSize(input: string): number {
  // TODO
  throw new Error('TODO: parseByteSize');
}

export function parseDuration(input: string): number {
  // TODO
  throw new Error('TODO: parseDuration');
}
