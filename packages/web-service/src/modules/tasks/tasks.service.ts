import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { CreateTaskDto } from './dto/create-task.dto.js';
import type { UpdateTaskDto } from './dto/update-task.dto.js';
import { TaskStatus, type Task } from './tasks.types.js';

/**
 * 内存仓储只用于教学。
 * 真实项目把 Map 换成 Repository（Prisma/TypeORM/Drizzle），controller 与测试基本不变。
 */
@Injectable()
export class TasksService {
  private readonly tasks = new Map<string, Task>();

  create(dto: CreateTaskDto): Task {
    const now = new Date().toISOString();
    const task: Task = {
      id: randomUUID(),
      title: dto.title,
      description: dto.description ?? '',
      status: dto.status ?? TaskStatus.Todo,
      createdAt: now,
      updatedAt: now,
    };

    this.tasks.set(task.id, task);
    return task;
  }

  findAll(status?: TaskStatus): Task[] {
    const tasks = [...this.tasks.values()].sort((a, b) =>
      a.createdAt.localeCompare(b.createdAt),
    );
    return status ? tasks.filter((task) => task.status === status) : tasks;
  }

  findOne(id: string): Task {
    const task = this.tasks.get(id);
    if (!task) {
      throw new NotFoundException(`任务 ${id} 不存在`);
    }
    return task;
  }

  update(id: string, dto: UpdateTaskDto): Task {
    const current = this.findOne(id);
    const next: Task = {
      ...current,
      title: dto.title ?? current.title,
      description: dto.description ?? current.description,
      status: dto.status ?? current.status,
      updatedAt: new Date().toISOString(),
    };

    this.tasks.set(id, next);
    return next;
  }

  remove(id: string): void {
    if (!this.tasks.delete(id)) {
      throw new NotFoundException(`任务 ${id} 不存在`);
    }
  }
}
