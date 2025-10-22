import { container } from 'tsyringe';
import { DataSource } from 'typeorm';

import { ICategoryRepository } from '@/modules/tasks/domain/repositories/ICategoryRepository';
import { ITaskRepository } from '@/modules/tasks/domain/repositories/ITaskRepository';
import { CategoryRepository } from '@/modules/tasks/infra/repositories/CategoryRepository';
import { TaskRepository } from '@/modules/tasks/infra/repositories/TaskRepository';
import AppDataSource from '@/shared/providers/typeorm';

export async function registerSharedProviders(): Promise<void> {
  const dataSource: DataSource = await AppDataSource();

  container.registerInstance<DataSource>('DataSource', dataSource);

  container.registerSingleton<ITaskRepository>('TaskRepository', TaskRepository);
  container.registerSingleton<ICategoryRepository>('CategoryRepository', CategoryRepository);
}
