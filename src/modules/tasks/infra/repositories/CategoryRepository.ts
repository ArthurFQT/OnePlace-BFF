import { inject, injectable } from 'tsyringe';
import { DataSource } from 'typeorm';

import { GenericRepository } from '@/shared/generic/repositories/GenericRepository';

import { Category } from '../../domain/entities/Category';
import { ICategoryRepository } from '../../domain/repositories/ICategoryRepository';

@injectable()
export class CategoryRepository extends GenericRepository<Category> implements ICategoryRepository {
  constructor(
    @inject('DataSource')
    dataSource: DataSource,
  ) {
    super(dataSource.getRepository(Category));
  }

  async findByName(name: string): Promise<Category | null> {
    return this.ormRepo.findOne({
      where: { name },
    });
  }

  async findWithTaskCount(): Promise<Array<Category & { taskCount: number }>> {
    const result = await this.ormRepo
      .createQueryBuilder('category')
      .leftJoin('category.tasks', 'task')
      .select([
        'category.id',
        'category.name',
        'category.description',
        'category.color',
        'category.createdAt',
        'category.updatedAt',
      ])
      .addSelect('COUNT(task.id)', 'taskCount')
      .groupBy('category.id')
      .getRawAndEntities();

    return result.entities.map((category, index) => ({
      ...category,
      taskCount: parseInt(result.raw[index].taskCount, 10) || 0,
    }));
  }
}
