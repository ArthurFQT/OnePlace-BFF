import { injectable, inject } from 'tsyringe';

import { ITaskRepository, TasksByPeriod } from '../../../domain/repositories/ITaskRepository';
import { TasksByPeriodResponseDto, TaskStatusCountResponseDto } from '../../dtos/TaskResponseDto';

@injectable()
export class GetTaskMetricsUseCase {
  constructor(
    @inject('TaskRepository')
    private taskRepository: ITaskRepository,
  ) {}

  async getTasksByPeriod(): Promise<TasksByPeriodResponseDto> {
    const metrics = await this.taskRepository.getTasksByPeriod();
    return metrics as TasksByPeriodResponseDto;
  }

  async getTaskStatusCount(): Promise<TaskStatusCountResponseDto> {
    const counts = await this.taskRepository.countTasksByStatus();
    return {
      pending: counts.pending,
      inProgress: counts.in_progress,
      completed: counts.completed,
      failed: counts.failed,
      cancelled: counts.cancelled,
    };
  }

  async getCustomPeriodMetrics(startDate: Date, endDate: Date) {
    return await this.taskRepository.getTaskMetrics(startDate, endDate);
  }
}