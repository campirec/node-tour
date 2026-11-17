import { parseArgs } from 'node:util';

export interface CliOptions {
  host: string;
  port: number;
  verbose: boolean;
  files: string[];
}

export function parseCli(argv: readonly string[]): CliOptions {
  const { values, positionals } = parseArgs({
    args: [...argv],
    options: {
      host: { type: 'string', default: 'localhost' },
      port: { type: 'string', default: '3000' },
      verbose: { type: 'boolean', short: 'v', default: false },
    },
    allowPositionals: true,
    strict: true,
  });

  const port = Number.parseInt(values.port, 10);
  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new RangeError('port 必须是 1-65535 的整数');
  }

  return {
    host: values.host,
    port,
    verbose: values.verbose,
    files: positionals,
  };
}
