import {
  Injectable,
  Logger,
  type CallHandler,
  type ExecutionContext,
  type NestInterceptor,
} from '@nestjs/common';
import { tap, type Observable } from 'rxjs';

interface RequestLike {
  id?: string;
  method?: string;
  url?: string;
}

/** 记录每个请求的耗时；requestId 由请求级中间件生成。 */
@Injectable()
export class RequestLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const startedAt = performance.now();
    const request = context.switchToHttp().getRequest<RequestLike>();

    return next.handle().pipe(
      tap({
        finalize: () => {
          const elapsed = Math.round(performance.now() - startedAt);
          this.logger.log(
            `${request.method ?? '?'} ${request.url ?? ''} ${elapsed}ms requestId=${request.id ?? '-'}`,
          );
        },
      }),
    );
  }
}
