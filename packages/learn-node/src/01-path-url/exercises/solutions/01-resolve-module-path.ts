import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export function resolveFromImportMeta(
  metaUrl: string,
  relativePath: string,
): string {
  const moduleFile = fileURLToPath(metaUrl);
  return resolve(dirname(moduleFile), relativePath);
}
