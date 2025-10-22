import { TaskPriority, TaskStatus } from '../../domain/entities/Task';

export class CategoryResponseDto {
  id: string;
  name: string;
  description?: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
  taskCount?: number;
}

export class TaskResponseDto {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  categoryId?: string;
  category?: CategoryResponseDto;
  startedAt?: Date;
  completedAt?: Date;
  dueDate?: Date;
  estimatedMinutes?: number;
  actualMinutes?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  durationInMinutes?: number | null;
  isOverdue?: boolean;
}

export class TaskMetricsResponseDto {
  totalTasks: number;
  completedTasks: number;
  failedTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  averageCompletionTimeMinutes: number | null;
  completionRate: number;
  overdueTasks: number;
}

export class TasksByPeriodResponseDto {
  daily: TaskMetricsResponseDto;
  weekly: TaskMetricsResponseDto;
  monthly: TaskMetricsResponseDto;
  yearly: TaskMetricsResponseDto;
}

export class PaginatedTasksResponseDto {
  tasks: TaskResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class TaskStatusCountResponseDto {
  pending: number;
  inProgress: number;
  completed: number;
  failed: number;
  cancelled: number;
}