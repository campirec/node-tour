/**
 * 练习 3：输出前脱敏环境变量。
 *
 * 场景：启动日志、诊断接口、错误上报。绝不能把 Secret 打印到日志。
 *
 * 要求：
 * - 不修改传入对象；
 * - 跳过值为 undefined 的键；
 * - key 以 _ 分段包含 SECRET / TOKEN / PASSWORD / PASS / KEY / CREDENTIAL(S) 时替换为 [redacted]；
 * - 普通变量保持原值（例如 PATH、NODE_ENV、MONKEY）。
 *
 * 示例：OPENAI_API_KEY、DB_PASSWORD、AUTH_TOKEN 都要脱敏。
 */
const SENSITIVE_KEY =
  /(^|_)(SECRET|TOKEN|PASSWORD|PASS|KEY|CREDENTIAL|CREDENTIALS)($|_)/i;

export function redactEnv(
  env: NodeJS.ProcessEnv = process.env,
): Record<string, string> {
  // TODO
  throw new Error('TODO: redactEnv');
}
