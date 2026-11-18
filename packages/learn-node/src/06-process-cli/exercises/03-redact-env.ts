/**
 * 练习 3：输出前脱敏环境变量
 *
 * 场景：启动日志、诊断接口、错误上报。绝不能把 Secret 打印到日志，
 * 需要在输出前自动识别敏感 key 并替换值。
 *
 * 函数签名
 *   redactEnv(env?: NodeJS.ProcessEnv): Record<string, string>
 *   - env：环境变量对象，默认 process.env
 *   - 返回：脱敏后的新对象，不修改原对象
 *
 * 示例
 *   redactEnv({
 *     PATH: '/usr/bin',
 *     NODE_ENV: 'production',
 *     OPENAI_API_KEY: 'secret-value',
 *     DB_PASSWORD: 'p@ss',
 *     AUTH_TOKEN: 'token',
 *     MAX_RETRIES: '3',
 *     MISSING: undefined,
 *   })
 *   => {
 *     PATH: '/usr/bin',
 *     NODE_ENV: 'production',
 *     OPENAI_API_KEY: '[redacted]',
 *     DB_PASSWORD: '[redacted]',
 *     AUTH_TOKEN: '[redacted]',
 *     MAX_RETRIES: '3',
 *   }
 *   // MISSING 为 undefined，不出现在结果中
 *
 * 要求
 *   1. 不修改传入对象，返回新对象；
 *   2. 跳过值为 undefined 的键（不写入结果，也不转成字符串）；
 *   3. key 以 _ 分段包含 SECRET / TOKEN / PASSWORD / PASS / KEY /
 *      CREDENTIAL(S) 时，值替换为 '[redacted]'（大小写不敏感）；
 *   4. 普通变量保持原值（如 PATH、NODE_ENV、MONKEY、MAX_RETRIES）。
 */
const SENSITIVE_KEY =
  /(^|_)(SECRET|TOKEN|PASSWORD|PASS|KEY|CREDENTIAL|CREDENTIALS)($|_)/i;

export function redactEnv(
  env: NodeJS.ProcessEnv = process.env,
): Record<string, string> {
  // TODO
  throw new Error('TODO: redactEnv');
}
