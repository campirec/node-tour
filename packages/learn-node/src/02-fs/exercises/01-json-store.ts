import { mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { dirname } from 'node:path';

/**
 * 练习 1：JSON 文件存储。
 *
 * readJsonFile：
 * - 读取 UTF-8 JSON；
 * - JSON 非法时抛出带文件路径的错误，并保留原始错误作为 cause。
 *
 * writeJsonAtomic：
 * - 自动创建父目录；
 * - 先写同目录临时文件，再 rename 覆盖目标，避免进程中断留下半个文件；
 * - 失败时清理临时文件。
 */
export async function readJsonFile<T>(filePath: string): Promise<T> {
  // TODO
  throw new Error('TODO: readJsonFile');
}

export async function writeJsonAtomic(
  filePath: string,
  value: unknown,
): Promise<void> {
  // TODO: mkdir -> writeFile(temp) -> rename(temp, target)
  throw new Error('TODO: writeJsonAtomic');
}
