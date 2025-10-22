import { IGenericRepository } from '@/shared/generic/repositories/IGenericRepository';

import { Category } from '../entities/Category';

export interface ICategoryRepository extends IGenericRepository<Category> {
  findByName(name: string): Promise<Category | null>;
  findWithTaskCount(): Promise<Array<Category & { taskCount: number }>>;
}