import { inject, injectable } from 'tsyringe';

import { AppError } from '@/shared/core/errors/AppError';

import { Category } from '../../../domain/entities/Category';
import { ICategoryRepository } from '../../../domain/repositories/ICategoryRepository';
import { CreateCategoryDto } from '../../dtos/CreateCategoryDto';

@injectable()
export class ManageCategoriesUseCase {
  constructor(
    @inject('CategoryRepository')
    private categoryRepository: ICategoryRepository,
  ) {}

  async createCategory(data: CreateCategoryDto): Promise<Category> {
    // Verificar se já existe uma categoria com o mesmo nome
    const existingCategory = await this.categoryRepository.findByName(data.name);
    if (existingCategory) {
      throw new AppError('Já existe uma categoria com este nome', 400);
    }

    return await this.categoryRepository.create({
      name: data.name,
      description: data.description,
      color: data.color || '#3B82F6',
    });
  }

  async getAllCategories(): Promise<Category[]> {
    return await this.categoryRepository.findAll({
      order: { name: 'ASC' },
    });
  }

  async getCategoriesWithTaskCount(): Promise<Array<Category & { taskCount: number }>> {
    return await this.categoryRepository.findWithTaskCount();
  }

  async getCategoryById(id: string): Promise<Category> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new AppError('Categoria não encontrada', 404);
    }
    return category;
  }

  async updateCategory(id: string, data: Partial<CreateCategoryDto>): Promise<Category> {
    const existingCategory = await this.categoryRepository.findById(id);
    if (!existingCategory) {
      throw new AppError('Categoria não encontrada', 404);
    }

    // Verificar se o novo nome já existe (se estiver sendo alterado)
    if (data.name && data.name !== existingCategory.name) {
      const categoryWithSameName = await this.categoryRepository.findByName(data.name);
      if (categoryWithSameName) {
        throw new AppError('Já existe uma categoria com este nome', 400);
      }
    }

    return await this.categoryRepository.updateSoft(id, data);
  }

  async deleteCategory(id: string): Promise<void> {
    const category = await this.categoryRepository.findById(id, {
      relations: ['tasks'],
    });

    if (!category) {
      throw new AppError('Categoria não encontrada', 404);
    }

    // Verificar se a categoria tem tarefas associadas
    if (category.tasks && category.tasks.length > 0) {
      throw new AppError('Não é possível excluir uma categoria que possui tarefas associadas', 400);
    }

    await this.categoryRepository.delete(id);
  }
}
