# ai-agent · OpenAI 兼容接口的 AI Agent

> 一个可运行、可测试、可扩展的最小 Agent：工具调用循环、类型安全参数校验、沙箱文件读取、历史裁剪、CLI 交互。默认接 OpenAI，也支持 DeepSeek / Qwen / Ollama 等 OpenAI 兼容端点。

## 快速开始

```bash
# 在仓库根目录
pnpm install

cd packages/ai-agent
cp env.example .env        # PowerShell: Copy-Item env.example .env
# 编辑 .env，填入 OPENAI_API_KEY

pnpm dev:agent
# 或
pnpm --filter @node-tour/ai-agent dev
```

进入交互后：

```
你> 计算 (12 + 8) * 3 / 4，然后告诉我现在几点
你> 读取 src/agent/agent.ts 并总结它的循环逻辑
你> /reset
你> /exit
```

## 环境变量

| 变量 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `OPENAI_API_KEY` | 是 | — | 兼容服务的 API Key；Ollama 可填任意值 |
| `OPENAI_BASE_URL` | 否 | OpenAI 官方 | 兼容端点，需包含 `/v1` |
| `OPENAI_MODEL` | 否 | `gpt-4o-mini` | 模型名 |
| `AGENT_TEMPERATURE` | 否 | `0.2` | 0–2 |
| `AGENT_MAX_STEPS` | 否 | `6` | 单次用户输入最多模型调用轮数 |
| `AGENT_MAX_HISTORY` | 否 | `40` | 保留的历史消息数（system 除外） |

### DeepSeek

```env
OPENAI_API_KEY=sk-...
OPENAI_BASE_URL=https://api.deepseek.com/v1
OPENAI_MODEL=deepseek-chat
```

### Ollama（本地）

```env
OPENAI_API_KEY=ollama
OPENAI_BASE_URL=http://localhost:11434/v1
OPENAI_MODEL=qwen2.5:7b
```

## 架构

```
src/
  cli.ts                        # readline 交互、打印工具事件
  config.ts                     # Zod 解析 .env / process.env
  agent/
    agent.ts                    # 工具调用循环
    memory.ts                   # 从 user 边界裁剪历史
    prompt.ts                   # system prompt
    errors.ts                   # AgentError / AgentMaxStepsError
    types.ts                    # AgentEvent / AgentRunResult
  providers/
    types.ts                    # ChatProvider 最小协议（可注入假实现）
    openai-compatible.ts        # OpenAI SDK 适配器
  tools/
    tool.ts                     # defineTool + Zod -> JSON Schema
    calculator.ts               # 安全算术解析器（不用 eval）
    current-time.ts             # 当前时间
    read-file.ts                # 工作目录内只读文本文件
    index.ts                    # createDefaultTools
test/                           # 全部离线测试，无真实 API 调用
```

一次运行的流程：

```
user
  └─> provider.complete(messages, tools)
        ├─ 没有 tool_calls ──> final content
        └─ 有 tool_calls
              ├─ 校验 JSON 参数
              ├─ 执行工具（未知工具/参数错误也作为 tool 消息回填）
              └─ 追加 tool 结果，进入下一轮（最多 maxSteps）
```

## 设计要点

- **Provider 抽象**：Agent 只依赖 `ChatProvider`，测试用脚本化假 Provider，不产生网络请求；另有一个本地 HTTP 集成测试验证 OpenAI SDK 请求/响应映射。
- **参数双重校验**：工具 schema 同时生成给模型的 JSON Schema，并在执行前用同一 Zod schema 校验模型输出。
- **错误不炸循环**：未知工具、非法 JSON、schema 不匹配、工具执行异常都会序列化成 `{ error }` 回填给模型，让它自我修正。
- **防止无限循环**：`maxSteps` 上限；超限抛 `AgentMaxStepsError`。
- **上下文控制**：按 user 边界裁剪历史，避免把 `assistant.tool_calls` 与 `tool` 结果拆散；工具结果超过 20k 字符会截断。
- **文件沙箱**：`read_file` 用 `realpath` + 路径前缀检查，阻止 `../` 与符号链接逃逸；限制 256KB。
- **无 shell 工具**：默认工具集不暴露任意命令执行，降低注入风险。
- **不泄漏密钥**：配置只从环境变量读取，日志不打印 key。

## 工具

| 工具 | 参数 | 用途 |
| --- | --- | --- |
| `calculator` | `{ expression }` | 安全解析 `+ - * / % ^`、括号、一元正负号 |
| `current_time` | `{}` | 当前 ISO 时间、本地时间、时区 |
| `read_file` | `{ path, maxBytes? }` | 读取工作目录内文本文件 |

### 新增工具

```ts
import { z } from 'zod';
import { defineTool } from './tool.js';

export const wordCountTool = defineTool({
  name: 'word_count',
  description: '统计文本的字符数与单词数',
  parameters: z.object({
    text: z.string().min(1),
  }),
  execute({ text }) {
    return {
      characters: [...text].length,
      words: text.trim().split(/\s+/).filter(Boolean).length,
    };
  },
});
```

然后把它加入 `createDefaultTools()`。`toProviderTool` 会自动把 Zod schema 转成 JSON Schema。

## 测试

```bash
pnpm --filter @node-tour/ai-agent test
pnpm --filter @node-tour/ai-agent typecheck
```

覆盖：

- 工具调用 → 结果回填 → 最终回答
- 未知工具 / 非法 JSON / schema 错误回填
- maxSteps、空输入、重复工具名
- 历史裁剪不拆散工具消息
- 计算器语法与错误
- 文件沙箱越界
- Provider 与 OpenAI Chat Completions 协议的本地 HTTP 集成测试

## 当前边界与下一步

当前是教学版最小实现，尚未包含：

- 流式输出（streaming tool_calls 增量拼接）
- 并行工具调用
- 会话持久化 / 多用户隔离
- RAG、向量库、网页搜索
- 结构化输出、评测集、追踪（Langfuse/OpenTelemetry）
- 工具级权限、审批、预算与速率限制

建议按顺序扩展：流式输出 → 持久化 → 并行工具 → RAG → 可观测性与评测。
