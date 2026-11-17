import { readdir } from 'node:fs/promises';
import { join } from 'node:path';

export async function listFilesRecursive(root: string): Promise<string[]> {
  const files: string[] = [];

  async function walk(directory: string, prefix: string): Promise<void> {
    const entries = await readdir(directory, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isSymbolicLink()) {
        continue;
      }
      const relativePath = prefix
        ? `${prefix}/${entry.name}`
        : entry.name;
      if (entry.isDirectory()) {
        await walk(join(directory, entry.name), relativePath);
      } else if (entry.isFile()) {
        files.push(relativePath);
      }
    }
  }

  await walk(root, '');
  return files.sort();
}
