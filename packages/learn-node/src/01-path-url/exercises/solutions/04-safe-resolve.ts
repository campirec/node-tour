import { resolve, sep } from 'node:path';

export class PathEscapeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PathEscapeError';
  }
}

export function resolveWithinRoot(root: string, userPath: string): string {
  if (!userPath || userPath.includes('\0')) {
    throw new PathEscapeError('路径为空或包含非法字符');
  }

  const rootPath = resolve(root);
  const target = resolve(rootPath, userPath);
  const caseFold = (value: string): string =>
    process.platform === 'win32' ? value.toLowerCase() : value;

  const normalizedRoot = caseFold(rootPath);
  const normalizedTarget = caseFold(target);
  const rootPrefix = caseFold(
    rootPath.endsWith(sep) ? rootPath : `${rootPath}${sep}`,
  );

  if (
    normalizedTarget !== normalizedRoot &&
    !normalizedTarget.startsWith(rootPrefix)
  ) {
    throw new PathEscapeError('路径超出允许范围');
  }

  return target;
}
