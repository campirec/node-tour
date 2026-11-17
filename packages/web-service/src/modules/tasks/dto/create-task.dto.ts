import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';
import { TaskStatus } from '../tasks.types.js';

export class CreateTaskDto {
  @ApiProperty({
    description: '任务标题',
    minLength: 1,
    maxLength: 120,
    example: '完成 Node.js Stream 练习',
  })
  @IsString()
  @Length(1, 120)
  title!: string;

  @ApiPropertyOptional({
    description: '任务描述',
    maxLength: 500,
    example: '实现一个 Transform 流',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({
    description: '任务状态',
    enum: TaskStatus,
    default: TaskStatus.Todo,
  })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;
}
