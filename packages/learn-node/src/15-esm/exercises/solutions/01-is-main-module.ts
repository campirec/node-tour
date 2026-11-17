import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export function isMainModule(
  metaUrl: string,
  argv1: string | undefined = process.argv[1],
): boolean {
  if (!argv1) {
    return false;
  }
  return pathToFileURL(resolve(argv1)).href === metaUrl;
}
