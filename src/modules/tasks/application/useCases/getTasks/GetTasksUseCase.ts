import { injectable, inject } from 'tsyringe';
import { FindManyOptions, Like, Between } from 'typeorm';

import { Task } from '../../../domain/entities/Task';
import { ITaskRepository } from '../../../domain/repositories/ITaskRepository';
import { GetTasksQueryDto } from '../../dtos/GetTasksQueryDto';
import { PaginatedTasksResponseDto } from '../../dtos/TaskResponseDto';

@injectable()
export class GetTasksUseCase {
  constructor(
    @inject('TaskRepository')
    private taskRepository: ITaskRepository,
  ) {}

  async execute(query: GetTasksQueryDto): Promise<PaginatedTasksResponseDto> {
    const {
      status,
      priority,
      categoryId,
      startDate,
      endDate,
      search,
      page = 0,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      overdue,
    } = query;

    // Construir filtros
    const where: any = {};
    
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (categoryId) where.categoryId = categoryId;
    
    if (search) {
      where.title = Like(`%${search}%`);
    }

    if (startDate && endDate) {
      where.createdAt = Between(new Date(startDate), new Date(endDate));
    }

    const options: FindManyOptions<Task> = {
      where,
      relations: ['category'],
      skip: page * limit,
      take: limit,
      order: {
        [sortBy]: sortOrder,
      },
    };

    let tasks: Task[];
    let total: number;

    if (overdue) {
      // Para tarefas em atraso, usar método específico
      tasks = await this.taskRepository.findOverdueTasks(options);
      total = tasks.length; // Para simplificar, não fazemos count separado para overdue
    } else {
      [tasks, total] = await this.taskRepository.findAndCount(options);
    }

    // Adicionar propriedades calculadas
    const tasksWithCalculatedFields = tasks.map(task => ({
      ...task,
      durationInMinutes: task.getDurationInMinutes(),
      isOverdue: task.isOverdue(),
    }));

    const totalPages = Math.ceil(total / limit);

    return {
      tasks: tasksWithCalculatedFields as any,
      total,
      page,
      limit,
      totalPages,
    };
  }
}