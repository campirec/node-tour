const SENSITIVE_KEY =
  /(^|_)(SECRET|TOKEN|PASSWORD|PASS|KEY|CREDENTIAL|CREDENTIALS)($|_)/i;

export function redactEnv(
  env: NodeJS.ProcessEnv = process.env,
): Record<string, string> {
  const result: Record<string, string> = {};

  for (const [key, value] of Object.entries(env)) {
    if (value === undefined) {
      continue;
    }
    result[key] = SENSITIVE_KEY.test(key) ? '[redacted]' : value;
  }

  return result;
}
