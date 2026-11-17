export class CursorError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'CursorError';
  }
}

export interface Cursor {
  createdAt: string;
  id: string;
}

interface CursorPayload extends Cursor {
  v: 1;
}

function assertCursor(cursor: Cursor): void {
  if (!cursor.id || typeof cursor.id !== 'string') {
    throw new CursorError('cursor.id 必须是非空字符串');
  }
  if (
    !cursor.createdAt ||
    typeof cursor.createdAt !== 'string' ||
    !Number.isFinite(Date.parse(cursor.createdAt))
  ) {
    throw new CursorError('cursor.createdAt 必须是合法日期字符串');
  }
}

export function encodeCursor(cursor: Cursor): string {
  assertCursor(cursor);
  const payload: CursorPayload = {
    v: 1,
    createdAt: cursor.createdAt,
    id: cursor.id,
  };
  return Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
}

export function decodeCursor(value: string): Cursor {
  if (!value || !/^[A-Za-z0-9_-]+$/.test(value)) {
    throw new CursorError('cursor 不是合法 base64url');
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(Buffer.from(value, 'base64url').toString('utf8'));
  } catch (error) {
    throw new CursorError('cursor 不是合法 JSON', { cause: error });
  }

  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    throw new CursorError('cursor 必须是 JSON 对象');
  }

  const payload = parsed as Record<string, unknown>;
  if (payload.v !== 1) {
    throw new CursorError('不支持的 cursor 版本');
  }
  if (typeof payload.id !== 'string' || typeof payload.createdAt !== 'string') {
    throw new CursorError('cursor 缺少 id 或 createdAt');
  }

  const cursor: Cursor = {
    createdAt: payload.createdAt,
    id: payload.id,
  };
  assertCursor(cursor);
  return cursor;
}
