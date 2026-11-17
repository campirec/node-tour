import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { ListTasksQueryDto } from './dto/list-tasks-query.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import { TasksService } from './tasks.service.js';
import type { Task } from './tasks.types.js';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: '创建任务' })
  @ApiCreatedResponse({ description: '创建成功' })
  create(@Body() dto: CreateTaskDto): Task {
    return this.tasksService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: '查询任务列表' })
  @ApiOkResponse({ description: '任务列表' })
  findAll(@Query() query: ListTasksQueryDto): Task[] {
    return this.tasksService.findAll(query.status);
  }

  @Get(':id')
  @ApiOperation({ summary: '查询单个任务' })
  @ApiNotFoundResponse({ description: '任务不存在' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Task {
    return this.tasksService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新任务（部分字段）' })
  @ApiNotFoundResponse({ description: '任务不存在' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTaskDto,
  ): Task {
    return this.tasksService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '删除任务' })
  @ApiNoContentResponse({ description: '删除成功' })
  @ApiNotFoundResponse({ description: '任务不存在' })
  remove(@Param('id', ParseUUIDPipe) id: string): void {
    this.tasksService.remove(id);
  }
}
