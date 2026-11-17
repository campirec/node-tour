import { stdin, stdout } from 'node:process';
import { createInterface } from 'node:readline/promises';
import { Agent } from './agent/agent.js';
import { SYSTEM_PROMPT } from './agent/prompt.js';
import { loadConfig } from './config.js';
import { OpenAICompatibleProvider } from './providers/openai-compatible.js';
import { createDefaultTools } from './tools/index.js';

function preview(text: string, max = 400): string {
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

async function main(): Promise<void> {
  const config = loadConfig();
  const provider = new OpenAICompatibleProvider({
    apiKey: config.OPENAI_API_KEY,
    baseURL: config.OPENAI_BASE_URL,
    model: config.OPENAI_MODEL,
    temperature: config.AGENT_TEMPERATURE,
  });

  const agent = new Agent({
    provider,
    tools: createDefaultTools(),
    systemPrompt: SYSTEM_PROMPT,
    maxSteps: config.AGENT_MAX_STEPS,
    maxHistoryMessages: config.AGENT_MAX_HISTORY,
    onEvent(event) {
      switch (event.type) {
        case 'tool-call':
          console.log(
            `\n  ↳ 调用工具 ${event.name}(${JSON.stringify(event.arguments)})`,
          );
          break;
        case 'tool-result':
          console.log(
            `  ↳ ${event.isError ? '工具错误' : '工具结果'} ${preview(event.content)}`,
          );
          break;
        default:
          break;
      }
    },
  });

  console.log('Node Tour AI Agent');
  console.log(`模型: ${config.OPENAI_MODEL}${config.OPENAI_BASE_URL ? ` @ ${config.OPENAI_BASE_URL}` : ''}`);
  console.log('命令: /reset 清空上下文，/exit 退出');

  const readline = createInterface({ input: stdin, output: stdout });
  readline.on('SIGINT', () => {
    console.log('\n已退出');
    readline.close();
    process.exit(0);
  });

  try {
    for (;;) {
      const line = (await readline.question('\n你> ')).trim();
      if (!line) {
        continue;
      }
      if (line === '/exit' || line === '/quit') {
        break;
      }
      if (line === '/reset') {
        agent.reset();
        console.log('上下文已清空');
        continue;
      }

      try {
        const result = await agent.run(line);
        console.log(`\n助手> ${result.content}`);
        console.log(`（${result.steps} 轮模型调用）`);
      } catch (error) {
        console.error(
          `\n运行失败: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }
  } finally {
    readline.close();
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
