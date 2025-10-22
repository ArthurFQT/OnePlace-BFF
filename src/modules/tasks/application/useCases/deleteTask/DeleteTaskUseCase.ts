import { injectable, inject } from 'tsyringe';

import { AppError } from '@/shared/core/errors/AppError';

import { ITaskRepository } from '../../../domain/repositories/ITaskRepository';

@injectable()
export class DeleteTaskUseCase {
  constructor(
    @inject('TaskRepository')
    private taskRepository: ITaskRepository,
  ) {}

  async execute(id: string): Promise<void> {
    // Verificar se a tarefa existe
    const existingTask = await this.taskRepository.findById(id);
    if (!existingTask) {
      throw new AppError('Tarefa não encontrada', 404);
    }

    // Deletar a tarefa
    await this.taskRepository.delete(id);
  }
}