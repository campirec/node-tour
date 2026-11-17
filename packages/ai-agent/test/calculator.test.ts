import { describe, expect, it } from 'vitest';
import {
  calculatorTool,
  evaluateExpression,
} from '../src/tools/calculator.js';
import { toProviderTool } from '../src/tools/tool.js';

describe('evaluateExpression', () => {
  it.each([
    ['2 + 3 * 4', 14],
    ['(2 + 3) * 4', 20],
    ['-3^2', -9],
    ['2^3^2', 512],
    ['2^-2', 0.25],
    ['10 % 3', 1],
    ['  42  ', 42],
    ['1.5 * 2', 3],
  ])('%s = %s', (expression, expected) => {
    expect(evaluateExpression(expression)).toBe(expected);
  });

  it('拒绝除零和非法表达式', () => {
    expect(() => evaluateExpression('1 / 0')).toThrowError('除数不能为 0');
    expect(() => evaluateExpression('1 +')).toThrowError();
    expect(() => evaluateExpression('abc')).toThrowError();
    expect(() => evaluateExpression('(1 + 2')).toThrowError('缺少右括号');
    expect(() => evaluateExpression('1)')).toThrowError();
  });

  it('工具返回值包含原表达式与结果', async () => {
    const result = await calculatorTool.execute(
      { expression: '6 * 7' },
      { cwd: process.cwd() },
    );

    expect(result).toEqual({ expression: '6 * 7', result: 42 });
  });

  it('转换为 OpenAI 工具 schema 时去掉 $schema', () => {
    const tool = toProviderTool(calculatorTool);

    expect(tool.name).toBe('calculator');
    expect(tool.parameters).toMatchObject({
      type: 'object',
      properties: {
        expression: { type: 'string' },
      },
      required: ['expression'],
    });
    expect(tool.parameters).not.toHaveProperty('$schema');
  });
});
