export enum TaskStatus {
  Todo = 'todo',
  InProgress = 'in_progress',
  Done = 'done',
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}
