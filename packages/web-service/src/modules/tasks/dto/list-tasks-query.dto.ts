import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { TaskStatus } from '../tasks.types.js';

export class ListTasksQueryDto {
  @ApiPropertyOptional({
    description: '按状态筛选',
    enum: TaskStatus,
  })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;
}
