import { isAbsolute, parse, relative, resolve, sep } from 'node:path';

export interface PathInfo {
  dir: string;
  name: string;
  ext: string;
  isAbsolute: boolean;
  relativeToCwd: string;
}

export function inspectPath(
  input: string,
  cwd: string = process.cwd(),
): PathInfo {
  const absolutePath = resolve(cwd, input);
  const parsed = parse(absolutePath);

  return {
    dir: parsed.dir,
    name: parsed.name,
    ext: parsed.ext,
    isAbsolute: isAbsolute(input),
    relativeToCwd: relative(cwd, absolutePath).split(sep).join('/'),
  };
}
