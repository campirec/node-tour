import type { ProviderMessage } from '../providers/types.js';

export type AgentEvent =
  | { type: 'step'; step: number }
  | { type: 'tool-call'; name: string; arguments: unknown }
  | {
      type: 'tool-result';
      name: string;
      content: string;
      isError: boolean;
    }
  | { type: 'final'; content: string };

export interface AgentRunResult {
  content: string;
  steps: number;
  messages: ProviderMessage[];
}
