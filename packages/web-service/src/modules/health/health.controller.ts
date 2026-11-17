import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { HealthService } from './health.service.js';
import type { HealthStatus } from './health.types.js';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: '存活探针' })
  @ApiOkResponse({ description: '服务正常' })
  check(): HealthStatus {
    return this.healthService.check();
  }
}
