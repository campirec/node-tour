import { mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { dirname } from 'node:path';

/**
 * 练习 1：JSON 文件原子读写
 *
 * 场景：配置文件持久化、状态快照落盘。进程可能在写入过程中被 kill，
 * 直接 writeFile 会留下半个 JSON 文件，导致下次启动解析失败。
 *
 * 函数签名
 *   readJsonFile<T>(filePath: string): Promise<T>
 *   - filePath：JSON 文件路径
 *   - 返回：解析后的 JSON 值；文件不存在时保留原始 ENOENT 错误
 *
 *   writeJsonAtomic(filePath: string, value: unknown): Promise<void>
 *   - filePath：目标文件路径，父目录不存在时自动创建
 *   - value：待序列化的值，以 2 空格缩进写入，末尾追加 '\n'
 *
 * 示例
 *   await writeJsonAtomic('/conf/state.json', { version: 2 })
 *   // 文件内容为 '{\n  "version": 2\n}\n'，同目录不残留临时文件
 *
 *   await readJsonFile('/conf/state.json')
 *   => { version: 2 }
 *
 *   await readJsonFile('/conf/broken.json')  // 文件内容为 '{ not json'
 *   => 抛 Error('JSON 解析失败：/conf/broken.json')，cause 为原始语法错误
 *
 * 要求
 *   1. writeJsonAtomic 先写同目录临时文件（名称含 pid 与随机 UUID），
 *      再 rename 原子覆盖目标，避免写入中断产生损坏文件；
 *   2. writeJsonAtomic 失败时清理临时文件（rm force），不残留；
 *   3. writeJsonAtomic 自动创建尚不存在的父目录（mkdir recursive）；
 *   4. 写入内容使用 JSON.stringify(value, null, 2) 并在末尾追加 '\n'；
 *   5. readJsonFile 以 UTF-8 读取并 JSON.parse；
 *   6. readJsonFile 遇到 JSON 语法错误时抛 Error('JSON 解析失败：<filePath>')，
 *      并将原始 SyntaxError 作为 cause；文件不存在时保留 ENOENT 不包装。
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
