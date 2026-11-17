import { NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it } from 'vitest';
import { TasksService } from './tasks.service.js';
import { TaskStatus } from './tasks.types.js';

describe('TasksService', () => {
  let service: TasksService;

  beforeEach(() => {
    service = new TasksService();
  });

  it('创建任务时补齐默认状态与时间戳', () => {
    const task = service.create({ title: '学习 Stream' });

    expect(task.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
    expect(task.status).toBe(TaskStatus.Todo);
    expect(task.description).toBe('');
    expect(task.createdAt).toBe(task.updatedAt);
  });

  it('按状态筛选，并按创建时间排序', () => {
    const first = service.create({ title: 'A' });
    const second = service.create({ title: 'B', status: TaskStatus.Done });

    expect(service.findAll().map((task) => task.id)).toEqual([
      first.id,
      second.id,
    ]);
    expect(service.findAll(TaskStatus.Done)).toEqual([second]);
  });

  it('部分更新不会覆盖未提供的字段', () => {
    const created = service.create({
      title: '原标题',
      description: '原描述',
      status: TaskStatus.Todo,
    });

    const updated = service.update(created.id, { status: TaskStatus.Done });

    expect(updated).toMatchObject({
      id: created.id,
      title: '原标题',
      description: '原描述',
      status: TaskStatus.Done,
    });
  });

  it('查询或删除不存在的任务抛出 404', () => {
    expect(() => service.findOne('missing')).toThrowError(NotFoundException);
    expect(() => service.remove('missing')).toThrowError(NotFoundException);
  });

  it('删除后不可再查询', () => {
    const task = service.create({ title: '临时任务' });
    service.remove(task.id);

    expect(service.findAll()).toHaveLength(0);
    expect(() => service.findOne(task.id)).toThrowError(NotFoundException);
  });
});
