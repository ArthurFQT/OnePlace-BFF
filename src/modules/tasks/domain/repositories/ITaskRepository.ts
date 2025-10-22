import { FindManyOptions } from 'typeorm';

import { IGenericRepository } from '@/shared/generic/repositories/IGenericRepository';

import { Task, TaskStatus } from '../entities/Task';

export interface TaskMetrics {
  totalTasks: number;
  completedTasks: number;
  failedTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  averageCompletionTimeMinutes: number | null;
  completionRate: number;
  overdueTasks: number;
}

export interface TasksByPeriod {
  daily: TaskMetrics;
  weekly: TaskMetrics;
  monthly: TaskMetrics;
  yearly: TaskMetrics;
}

export interface ITaskRepository extends IGenericRepository<Task> {
  findByStatus(status: TaskStatus, options?: FindManyOptions<Task>): Promise<Task[]>;
  findByCategoryId(categoryId: string, options?: FindManyOptions<Task>): Promise<Task[]>;
  findOverdueTasks(options?: FindManyOptions<Task>): Promise<Task[]>;
  findTasksByDateRange(startDate: Date, endDate: Date, options?: FindManyOptions<Task>): Promise<Task[]>;
  getTaskMetrics(startDate?: Date, endDate?: Date): Promise<TaskMetrics>;
  getTasksByPeriod(): Promise<TasksByPeriod>;
  countTasksByStatus(): Promise<Record<TaskStatus, number>>;
}