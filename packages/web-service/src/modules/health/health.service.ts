import { Injectable } from '@nestjs/common';
import type { HealthStatus } from './health.types.js';

@Injectable()
export class HealthService {
  private readonly startedAt = Date.now();

  check(): HealthStatus {
    return {
      status: 'ok',
      uptime: Math.round((Date.now() - this.startedAt) / 1000),
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version ?? '0.1.0',
    };
  }
}
