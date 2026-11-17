import { calculatorTool } from './calculator.js';
import { currentTimeTool } from './current-time.js';
import { readFileTool } from './read-file.js';
import type { AgentTool } from './tool.js';

export { calculatorTool, evaluateExpression } from './calculator.js';
export { currentTimeTool } from './current-time.js';
export { readFileTool } from './read-file.js';
export { defineTool, toProviderTool } from './tool.js';
export type { AgentTool, ToolContext } from './tool.js';

export function createDefaultTools(): AgentTool[] {
  return [calculatorTool, currentTimeTool, readFileTool];
}
