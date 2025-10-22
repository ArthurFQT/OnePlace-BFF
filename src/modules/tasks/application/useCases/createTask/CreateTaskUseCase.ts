import { inject, injectable } from 'tsyringe';

import { AppError } from '@/shared/core/errors/AppError';

import { Task } from '../../../domain/entities/Task';
import { ICategoryRepository } from '../../../domain/repositories/ICategoryRepository';
import { ITaskRepository } from '../../../domain/repositories/ITaskRepository';
import { CreateTaskDto } from '../../dtos/CreateTaskDto';

@injectable()
export class CreateTaskUseCase {
  constructor(
    @inject('TaskRepository')
    private taskRepository: ITaskRepository,
    @inject('CategoryRepository')
    private categoryRepository: ICategoryRepository,
  ) {}

  async execute(data: CreateTaskDto): Promise<Task> {
    // Validar se a categoria existe (se fornecida)
    if (data.category_id) {
      const category = await this.categoryRepository.findById(data.category_id);
      if (!category) {
        throw new AppError('Categoria não encontrada', 404);
      }
    }

    // Criar a tarefa
    const task = await this.taskRepository.create({
      title: data.title,
      description: data.description,
      priority: data.priority,
      category_id: data.category_id,
      due_date: data.due_date ? new Date(data.due_date) : undefined,
      estimated_minutes: data.estimated_minutes,
      notes: data.notes,
    });

    // Buscar a tarefa criada com a categoria
    const createdTask = await this.taskRepository.findById(task.id, {
      relations: ['category'],
    });

    if (!createdTask) {
      throw new AppError('Erro ao criar tarefa', 500);
    }

    return createdTask;
  }
}
