import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { Controller, Get, Tags } from '@/shared/http/docs/decorators';

import { GetTasksUseCase } from './GetTasksUseCase';

@Tags('Tasks')
@Controller('/tasks')
export class GetTasksController {
  @Get('')
  async handle(req: Request, res: Response): Promise<Response> {
    const useCase = container.resolve(GetTasksUseCase);
    const result = await useCase.execute(req.query as any);
    return res.json(result);
  }
}
