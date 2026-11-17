import { spawn } from 'node:child_process';
import { StringDecoder } from 'node:string_decoder';

export async function collectLines(
  file: string,
  args: readonly string[],
  input?: string,
): Promise<string[]> {
  return new Promise<string[]>((resolve, reject) => {
    const child = spawn(file, [...args], {
      stdio: ['pipe', 'pipe', 'pipe'],
      windowsHide: true,
    });
    const decoder = new StringDecoder('utf8');
    const lines: string[] = [];
    let buffer = '';
    let stderr = '';

    child.stdout.on('data', (chunk: Buffer) => {
      buffer += decoder.write(chunk);
      let index = buffer.indexOf('\n');
      while (index !== -1) {
        lines.push(buffer.slice(0, index).replace(/\r$/, ''));
        buffer = buffer.slice(index + 1);
        index = buffer.indexOf('\n');
      }
    });

    child.stderr.on('data', (chunk: Buffer) => {
      stderr += chunk.toString('utf8');
    });

    child.on('error', reject);

    child.on('close', (code, signal) => {
      buffer += decoder.end();
      if (buffer.length > 0) {
        lines.push(buffer.replace(/\r$/, ''));
      }

      if (code === 0) {
        resolve(lines);
      } else {
        reject(
          new Error(
            `命令退出码 ${code ?? signal ?? 'unknown'}: ${stderr.trim()}`,
          ),
        );
      }
    });

    child.stdin.end(input ?? '');
  });
}
