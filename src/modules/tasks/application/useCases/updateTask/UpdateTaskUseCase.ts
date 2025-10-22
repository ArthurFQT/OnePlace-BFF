import { inject, injectable } from 'tsyringe';

import { AppError } from '@/shared/core/errors/AppError';

import { Task, TaskStatus } from '../../../domain/entities/Task';
import { ICategoryRepository } from '../../../domain/repositories/ICategoryRepository';
import { ITaskRepository } from '../../../domain/repositories/ITaskRepository';
import { UpdateTaskDto } from '../../dtos/UpdateTaskDto';

@injectable()
export class UpdateTaskUseCase {
  constructor(
    @inject('TaskRepository')
    private taskRepository: ITaskRepository,
    @inject('CategoryRepository')
    private categoryRepository: ICategoryRepository,
  ) {}

  async execute(id: string, data: UpdateTaskDto): Promise<Task> {
    // Verificar se a tarefa existe
    const existingTask = await this.taskRepository.findById(id);
    if (!existingTask) {
      throw new AppError('Tarefa não encontrada', 404);
    }

    // Validar se a categoria existe (se fornecida)
    if (data.categoryId) {
      const category = await this.categoryRepository.findById(data.categoryId);
      if (!category) {
        throw new AppError('Categoria não encontrada', 404);
      }
    }

    // Preparar dados para atualização
    const updateData: Partial<Task> = {
      ...data,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
    };

    // Lógica especial para mudanças de status
    if (data.status && data.status !== existingTask.status) {
      switch (data.status) {
        case TaskStatus.IN_PROGRESS:
          if (existingTask.status === TaskStatus.PENDING && !existingTask.startedAt) {
            updateData.startedAt = new Date();
          }
          break;

        case TaskStatus.COMPLETED:
          updateData.completedAt = new Date();
          if (existingTask.startedAt && !existingTask.actualMinutes) {
            const duration = Math.round(
              (new Date().getTime() - existingTask.startedAt.getTime()) / (1000 * 60),
            );
            updateData.actualMinutes = duration;
          }
          break;

        case TaskStatus.FAILED:
          updateData.completedAt = new Date();
          if (existingTask.startedAt && !existingTask.actualMinutes) {
            const duration = Math.round(
              (new Date().getTime() - existingTask.startedAt.getTime()) / (1000 * 60),
            );
            updateData.actualMinutes = duration;
          }
          break;
      }
    }

    // Atualizar a tarefa
    const updatedTask = await this.taskRepository.updateSoft(id, updateData);

    // Buscar a tarefa atualizada com a categoria
    const taskWithCategory = await this.taskRepository.findById(id, {
      relations: ['category'],
    });

    if (!taskWithCategory) {
      throw new AppError('Erro ao atualizar tarefa', 500);
    }

    return taskWithCategory;
  }
}
