import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { Controller, Delete, Get, Patch, Post, Tags } from '@/shared/http/docs/decorators';

import { ManageCategoriesUseCase } from './ManageCategoriesUseCase';

@Tags('Categories')
@Controller('/categories')
export class ManageCategoriesController {
  @Post('/')
  async create(req: Request, res: Response): Promise<Response> {
    const useCase = container.resolve(ManageCategoriesUseCase);
    const result = await useCase.createCategory(req.body as any);
    return res.status(201).json(result);
  }

  @Get('/')
  async list(req: Request, res: Response): Promise<Response> {
    const useCase = container.resolve(ManageCategoriesUseCase);
    const result = await useCase.getAllCategories();
    return res.json(result);
  }

  @Get('with-count')
  async listWithCount(req: Request, res: Response): Promise<Response> {
    const useCase = container.resolve(ManageCategoriesUseCase);
    const result = await useCase.getCategoriesWithTaskCount();
    return res.json(result);
  }

  @Get(':id')
  async getById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const useCase = container.resolve(ManageCategoriesUseCase);
    const result = await useCase.getCategoryById(id);
    return res.json(result);
  }

  @Patch(':id')
  async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const useCase = container.resolve(ManageCategoriesUseCase);
    const result = await useCase.updateCategory(id, req.body as any);
    return res.json(result);
  }

  @Delete(':id')
  async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const useCase = container.resolve(ManageCategoriesUseCase);
    await useCase.deleteCategory(id);
    return res.status(204).send();
  }
}
