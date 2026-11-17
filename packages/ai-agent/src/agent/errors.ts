export class AgentError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'AgentError';
  }
}

export class AgentMaxStepsError extends AgentError {
  constructor(maxSteps: number) {
    super(`Agent 在 ${maxSteps} 轮内没有给出最终回答，已停止以避免无限循环`);
    this.name = 'AgentMaxStepsError';
  }
}
