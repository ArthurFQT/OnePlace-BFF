import { inject, injectable } from 'tsyringe';
import { DataSource, FindManyOptions } from 'typeorm';

import { GenericRepository } from '@/shared/generic/repositories/GenericRepository';

import { Task, TaskStatus } from '../../domain/entities/Task';
import {
  ITaskRepository,
  TaskMetrics,
  TasksByPeriod,
} from '../../domain/repositories/ITaskRepository';

@injectable()
export class TaskRepository extends GenericRepository<Task> implements ITaskRepository {
  constructor(
    @inject('DataSource')
    dataSource: DataSource,
  ) {
    super(dataSource.getRepository(Task));
  }

  async findByStatus(status: TaskStatus, options?: FindManyOptions<Task>): Promise<Task[]> {
    return this.ormRepo.find({
      ...options,
      where: {
        ...options?.where,
        status,
      },
      relations: ['category'],
    });
  }

  async findByCategoryId(category_id: string, options?: FindManyOptions<Task>): Promise<Task[]> {
    return this.ormRepo.find({
      ...options,
      where: {
        ...options?.where,
        category_id,
      },
      relations: ['category'],
    });
  }

  async findOverdueTasks(options?: FindManyOptions<Task>): Promise<Task[]> {
    const now = new Date();
    return this.ormRepo
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.category', 'category')
      .where('task.dueDate < :now', { now })
      .andWhere('task.status != :completedStatus', { completedStatus: TaskStatus.COMPLETED })
      .getMany();
  }

  async findTasksByDateRange(
    startDate: Date,
    endDate: Date,
    options?: FindManyOptions<Task>,
  ): Promise<Task[]> {
    return this.ormRepo.find({
      ...options,
      where: {
        ...options?.where,
        created_at: {
          $gte: startDate,
          $lte: endDate,
        } as any,
      },
      relations: ['category'],
    });
  }

  async getTaskMetrics(startDate?: Date, endDate?: Date): Promise<TaskMetrics> {
    const queryBuilder = this.ormRepo.createQueryBuilder('task');

    if (startDate && endDate) {
      queryBuilder.where('task.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate });
    }

    const tasks = await queryBuilder.getMany();

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === TaskStatus.COMPLETED).length;
    const failedTasks = tasks.filter(t => t.status === TaskStatus.FAILED).length;
    const pendingTasks = tasks.filter(t => t.status === TaskStatus.PENDING).length;
    const inProgressTasks = tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length;
    const overdueTasks = tasks.filter(t => t.isOverdue()).length;

    // Calcular tempo médio de conclusão
    const completedTasksWithDuration = tasks.filter(
      t => t.status === TaskStatus.COMPLETED && t.actual_minutes !== null,
    );

    const averageCompletionTimeMinutes =
      completedTasksWithDuration.length > 0
        ? completedTasksWithDuration.reduce((sum, task) => sum + (task.actual_minutes || 0), 0) /
          completedTasksWithDuration.length
        : null;

    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    return {
      totalTasks,
      completedTasks,
      failedTasks,
      pendingTasks,
      inProgressTasks,
      averageCompletionTimeMinutes,
      completionRate,
      overdueTasks,
    };
  }

  async getTasksByPeriod(): Promise<TasksByPeriod> {
    const now = new Date();

    // Início do dia atual
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Início da semana (domingo)
    const startOfWeek = new Date(startOfDay);
    startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay());

    // Início do mês
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Início do ano
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const [daily, weekly, monthly, yearly] = await Promise.all([
      this.getTaskMetrics(startOfDay, now),
      this.getTaskMetrics(startOfWeek, now),
      this.getTaskMetrics(startOfMonth, now),
      this.getTaskMetrics(startOfYear, now),
    ]);

    return { daily, weekly, monthly, yearly };
  }

  async countTasksByStatus(): Promise<Record<TaskStatus, number>> {
    const counts = await this.ormRepo
      .createQueryBuilder('task')
      .select('task.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('task.status')
      .getRawMany();

    const result = {
      [TaskStatus.PENDING]: 0,
      [TaskStatus.IN_PROGRESS]: 0,
      [TaskStatus.COMPLETED]: 0,
      [TaskStatus.FAILED]: 0,
      [TaskStatus.CANCELLED]: 0,
    };

    counts.forEach(({ status, count }) => {
      result[status as TaskStatus] = parseInt(count, 10);
    });

    return result;
  }
}
