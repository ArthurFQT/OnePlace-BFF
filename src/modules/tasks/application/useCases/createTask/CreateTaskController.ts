import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { Controller, Post, Tags } from '@/shared/http/docs/decorators';

import { CreateTaskUseCase } from './CreateTaskUseCase';

@Tags('Tasks')
@Controller('/tasks')
export class CreateTaskController {
  @Post('/')
  async handle(req: Request, res: Response): Promise<Response> {
    const useCase = container.resolve(CreateTaskUseCase);
    const result = await useCase.execute(req.body as any);
    return res.status(201).json(result);
  }
}
