import { z } from 'zod';
import { defineTool } from './tool.js';

export const currentTimeTool = defineTool({
  name: 'current_time',
  description:
    '获取当前日期时间。用户询问今天、现在、时区相关问题时使用；不要凭空猜测日期。',
  parameters: z.object({}),
  execute() {
    const now = new Date();
    return {
      iso: now.toISOString(),
      local: now.toLocaleString('zh-CN', { hour12: false }),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
  },
});
