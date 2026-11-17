import { z } from 'zod';
import { defineTool } from './tool.js';

/**
 * 不依赖 eval / new Function 的递归下降解析器。
 * 支持：+ - * / % ^、括号、一元正负号、小数。
 */
export function evaluateExpression(expression: string): number {
  const parser = new ExpressionParser(expression);
  const value = parser.parse();
  if (!Number.isFinite(value)) {
    throw new Error('计算结果不是有限数字');
  }
  return value;
}

class ExpressionParser {
  private index = 0;

  constructor(private readonly input: string) {}

  parse(): number {
    const value = this.parseExpression();
    this.skipSpaces();
    if (this.index < this.input.length) {
      throw new Error(`无法识别的字符：${this.input[this.index] ?? ''}`);
    }
    return value;
  }

  private parseExpression(): number {
    let left = this.parseTerm();
    for (;;) {
      this.skipSpaces();
      const operator = this.input[this.index];
      if (operator !== '+' && operator !== '-') {
        return left;
      }
      this.index += 1;
      const right = this.parseTerm();
      left = operator === '+' ? left + right : left - right;
    }
  }

  private parseTerm(): number {
    let left = this.parseUnary();
    for (;;) {
      this.skipSpaces();
      const operator = this.input[this.index];
      if (operator !== '*' && operator !== '/' && operator !== '%') {
        return left;
      }
      this.index += 1;
      const right = this.parseUnary();
      if ((operator === '/' || operator === '%') && right === 0) {
        throw new Error('除数不能为 0');
      }
      left =
        operator === '*'
          ? left * right
          : operator === '/'
            ? left / right
            : left % right;
    }
  }

  /**
   * 幂运算右结合：2^3^2 = 2^(3^2)。
   * 一元负号低于幂：-3^2 = -(3^2) = -9，2^-2 = 0.25。
   */
  private parsePower(): number {
    const base = this.parsePrimary();
    this.skipSpaces();
    if (this.input[this.index] !== '^') {
      return base;
    }
    this.index += 1;
    return base ** this.parseUnary();
  }

  private parseUnary(): number {
    this.skipSpaces();
    const char = this.input[this.index];
    if (char === '+') {
      this.index += 1;
      return this.parseUnary();
    }
    if (char === '-') {
      this.index += 1;
      return -this.parseUnary();
    }
    return this.parsePower();
  }

  private parsePrimary(): number {
    this.skipSpaces();
    if (this.input[this.index] === '(') {
      this.index += 1;
      const value = this.parseExpression();
      this.skipSpaces();
      if (this.input[this.index] !== ')') {
        throw new Error('缺少右括号');
      }
      this.index += 1;
      return value;
    }

    const match = /^(?:\d+(?:\.\d+)?|\.\d+)/.exec(
      this.input.slice(this.index),
    );
    if (!match) {
      throw new Error(`位置 ${this.index} 处需要数字`);
    }
    this.index += match[0].length;
    return Number(match[0]);
  }

  private skipSpaces(): void {
    while (this.input[this.index] === ' ') {
      this.index += 1;
    }
  }
}

export const calculatorTool = defineTool({
  name: 'calculator',
  description:
    '计算数学表达式，支持 + - * / % ^、括号和一元正负号。需要精确算术时优先使用此工具。',
  parameters: z.object({
    expression: z
      .string()
      .min(1)
      .describe('要计算的表达式，例如 (12 + 8) * 3 / 4'),
  }),
  execute({ expression }) {
    return {
      expression,
      result: evaluateExpression(expression),
    };
  },
});
