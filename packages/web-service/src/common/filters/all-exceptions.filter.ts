import {
  Catch,
  HttpException,
  HttpStatus,
  Logger,
  type ArgumentsHost,
  type ExceptionFilter,
} from '@nestjs/common';

interface RequestLike {
  id?: string;
  method?: string;
  url?: string;
}

interface ReplyLike {
  status(code: number): { send(payload: unknown): void };
}

interface ErrorBody {
  statusCode: number;
  error: string;
  message: string | string[];
  path: string;
  requestId: string | null;
  timestamp: string;
}

/**
 * 统一错误响应，避免每个 controller 自己拼错误结构。
 * 5xx 记录完整堆栈，4xx 只记录一行，生产环境不把内部异常细节返回给客户端。
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<RequestLike>();
    const reply = ctx.getResponse<ReplyLike>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const { error, message } = this.describe(exception, status);
    const body: ErrorBody = {
      statusCode: status,
      error,
      message,
      path: request.url ?? '',
      requestId: request.id ?? null,
      timestamp: new Date().toISOString(),
    };

    const context = `${request.method ?? 'UNKNOWN'} ${request.url ?? ''}`;
    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `${context} -> ${status}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    } else {
      this.logger.warn(`${context} -> ${status}`);
    }

    reply.status(status).send(body);
  }

  private describe(
    exception: unknown,
    status: number,
  ): { error: string; message: string | string[] } {
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      if (typeof response === 'string') {
        return { error: exception.name, message: response };
      }
      if (typeof response === 'object' && response !== null) {
        const record = response as Record<string, unknown>;
        return {
          error:
            typeof record.error === 'string' ? record.error : exception.name,
          message:
            typeof record.message === 'string' ||
            Array.isArray(record.message)
              ? (record.message as string | string[])
              : exception.message,
        };
      }
      return { error: exception.name, message: exception.message };
    }

    return {
      error: 'InternalServerError',
      message:
        status >= HttpStatus.INTERNAL_SERVER_ERROR
          ? '服务器内部错误'
          : '请求处理失败',
    };
  }
}
