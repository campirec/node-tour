import { mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { dirname } from 'node:path';

export async function readJsonFile<T>(filePath: string): Promise<T> {
  const text = await readFile(filePath, 'utf8');
  try {
    return JSON.parse(text) as T;
  } catch (error) {
    throw new Error(`JSON 解析失败：${filePath}`, { cause: error });
  }
}

export async function writeJsonAtomic(
  filePath: string,
  value: unknown,
): Promise<void> {
  await mkdir(dirname(filePath), { recursive: true });
  const tempPath = `${filePath}.${process.pid}.${randomUUID()}.tmp`;

  try {
    await writeFile(tempPath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
    await rename(tempPath, filePath);
  } catch (error) {
    await rm(tempPath, { force: true });
    throw error;
  }
}
