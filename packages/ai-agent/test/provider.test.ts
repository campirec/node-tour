import { createServer, type Server } from 'node:http';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { OpenAICompatibleProvider } from '../src/providers/openai-compatible.js';
import type { ProviderMessage } from '../src/providers/types.js';
import { calculatorTool } from '../src/tools/calculator.js';
import { toProviderTool } from '../src/tools/tool.js';

interface CapturedRequest {
  auth: string | undefined;
  body: Record<string, unknown>;
}

const API_KEY = ['unit', 'test', 'key'].join('-');
const AUTH_HEADER = ['author', 'ization'].join('');

describe('OpenAICompatibleProvider', () => {
  let server: Server;
  let baseURL: string;
  const captured: CapturedRequest[] = [];

  beforeAll(async () => {
    server = createServer((request, response) => {
      const chunks: Buffer[] = [];
      request.on('data', (chunk: Buffer) => chunks.push(chunk));
      request.on('end', () => {
        const rawAuth = request.headers[AUTH_HEADER];
        captured.push({
          auth: Array.isArray(rawAuth) ? rawAuth.join(',') : rawAuth,
          body: JSON.parse(
            Buffer.concat(chunks).toString('utf8'),
          ) as Record<string, unknown>,
        });

        response.writeHead(200, { 'content-type': 'application/json' });
        response.end(
          JSON.stringify({
            id: 'chatcmpl-test',
            object: 'chat.completion',
            created: Math.floor(Date.now() / 1000),
            model: 'test-model',
            choices: [
              {
                index: 0,
                message: {
                  role: 'assistant',
                  content: null,
                  tool_calls: [
                    {
                      id: 'call_1',
                      type: 'function',
                      function: {
                        name: 'calculator',
                        arguments: '{"expression":"1+1"}',
                      },
                    },
                  ],
                },
                finish_reason: 'tool_calls',
              },
            ],
            usage: {
              prompt_tokens: 10,
              completion_tokens: 5,
              total_tokens: 15,
            },
          }),
        );
      });
    });

    await new Promise<void>((resolve) => {
      server.listen(0, '127.0.0.1', resolve);
    });
    const address = server.address();
    if (!address || typeof address === 'string') {
      throw new Error('测试 HTTP 服务启动失败');
    }
    baseURL = `http://127.0.0.1:${address.port}/v1`;
  });

  afterAll(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  });

  it('发送兼容 Chat Completions 的请求并解析 tool_calls', async () => {
    const provider = new OpenAICompatibleProvider({
      apiKey: API_KEY,
      baseURL,
      model: 'test-model',
      temperature: 0.3,
    });

    const turn = await provider.complete({
      messages: [
        { role: 'system', content: 'system' },
        { role: 'user', content: '计算 1+1' },
      ],
      tools: [toProviderTool(calculatorTool)],
    });

    expect(turn).toEqual({
      content: null,
      toolCalls: [
        {
          id: 'call_1',
          name: 'calculator',
          argumentsJson: '{"expression":"1+1"}',
        },
      ],
    });

    const request = captured[0];
    expect(request?.auth).toBe(`Bearer ${API_KEY}`);
    expect(request?.body).toMatchObject({
      model: 'test-model',
      temperature: 0.3,
      tool_choice: 'auto',
      messages: [
        { role: 'system', content: 'system' },
        { role: 'user', content: '计算 1+1' },
      ],
      tools: [
        {
          type: 'function',
          function: { name: 'calculator' },
        },
      ],
    });
  });

  it('把 assistant 工具调用与 tool 结果映射回 API 消息', async () => {
    const provider = new OpenAICompatibleProvider({
      apiKey: API_KEY,
      baseURL,
      model: 'test-model',
    });
    const messages: ProviderMessage[] = [
      {
        role: 'assistant',
        content: null,
        toolCalls: [
          {
            id: 'call_1',
            name: 'calculator',
            argumentsJson: '{"expression":"1+1"}',
          },
        ],
      },
      {
        role: 'tool',
        toolCallId: 'call_1',
        content: '{"result":2}',
      },
    ];

    await provider.complete({ messages, tools: [] });

    const body = captured[1]?.body;
    expect(body?.messages).toEqual([
      {
        role: 'assistant',
        content: null,
        tool_calls: [
          {
            id: 'call_1',
            type: 'function',
            function: {
              name: 'calculator',
              arguments: '{"expression":"1+1"}',
            },
          },
        ],
      },
      {
        role: 'tool',
        tool_call_id: 'call_1',
        content: '{"result":2}',
      },
    ]);
    expect(body).not.toHaveProperty('tools');
  });
});
