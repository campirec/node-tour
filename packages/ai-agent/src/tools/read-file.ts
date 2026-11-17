import { readFile, realpath, stat } from 'node:fs/promises';
import { relative, resolve, sep } from 'node:path';
import { z } from 'zod';
import { defineTool } from './tool.js';

const MAX_FILE_BYTES = 256 * 1024;

/**
 * 只允许读取 cwd 下的文本文件。
 * 使用 realpath 解析后再比较前缀，避免 ../ 与符号链接逃逸。
 */
export const readFileTool = defineTool({
  name: 'read_file',
  description:
    '读取工作目录内的文本文件。只读、有大小限制，路径必须位于工作目录内。',
  parameters: z.object({
    path: z.string().min(1).describe('相对于工作目录的文件路径'),
    maxBytes: z
      .number()
      .int()
      .positive()
      .max(MAX_FILE_BYTES)
      .optional()
      .describe('最多读取的字节数，默认 64KB'),
  }),
  async execute({ path, maxBytes = 64 * 1024 }, context) {
    const root = await realpath(resolve(context.cwd));
    const target = await realpath(resolve(root, path));

    if (target !== root && !target.startsWith(root + sep)) {
      throw new Error('拒绝访问工作目录之外的路径');
    }

    const info = await stat(target);
    if (!info.isFile()) {
      throw new Error('目标不是普通文件');
    }
    if (info.size > MAX_FILE_BYTES) {
      throw new Error(`文件过大，最大允许 ${MAX_FILE_BYTES} 字节`);
    }

    const buffer = await readFile(target);
    return {
      path: relative(root, target),
      bytes: buffer.byteLength,
      content: buffer.subarray(0, maxBytes).toString('utf8'),
      truncated: buffer.byteLength > maxBytes,
    };
  },
});
