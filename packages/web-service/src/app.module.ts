import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter.js';
import { RequestLoggingInterceptor } from './common/interceptors/request-logging.interceptor.js';
import { envSchema } from './config/env.js';
import { HealthModule } from './modules/health/health.module.js';
import { TasksModule } from './modules/tasks/tasks.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
      validate: (raw) => envSchema.parse(raw),
    }),
    HealthModule,
    TasksModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: false },
      }),
    },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: APP_INTERCEPTOR, useClass: RequestLoggingInterceptor },
  ],
})
export class AppModule {}
