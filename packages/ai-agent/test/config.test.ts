import { describe, expect, it } from 'vitest';
import { parseConfig } from '../src/config.js';

const API_KEY = ['unit', 'test', 'key'].join('-');

describe('parseConfig', () => {
  it('只要求 API Key，其余字段有默认值', () => {
    expect(parseConfig({ OPENAI_API_KEY: API_KEY })).toEqual({
      OPENAI_API_KEY: API_KEY,
      OPENAI_MODEL: 'gpt-4o-mini',
      AGENT_TEMPERATURE: 0.2,
      AGENT_MAX_STEPS: 6,
      AGENT_MAX_HISTORY: 40,
    });
  });

  it('支持自定义兼容端点与字符串数字', () => {
    const config = parseConfig({
      OPENAI_API_KEY: API_KEY,
      OPENAI_BASE_URL: 'https://api.deepseek.com/v1',
      OPENAI_MODEL: 'deepseek-chat',
      AGENT_TEMPERATURE: '0.7',
      AGENT_MAX_STEPS: '10',
      AGENT_MAX_HISTORY: '20',
    });

    expect(config).toMatchObject({
      OPENAI_BASE_URL: 'https://api.deepseek.com/v1',
      OPENAI_MODEL: 'deepseek-chat',
      AGENT_TEMPERATURE: 0.7,
      AGENT_MAX_STEPS: 10,
      AGENT_MAX_HISTORY: 20,
    });
  });

  it('缺少 Key 或非法地址时立即失败', () => {
    expect(() => parseConfig({})).toThrowError(/OPENAI_API_KEY/);
    expect(() =>
      parseConfig({
        OPENAI_API_KEY: API_KEY,
        OPENAI_BASE_URL: 'not-a-url',
      }),
    ).toThrowError(/OPENAI_BASE_URL/);
  });
});
