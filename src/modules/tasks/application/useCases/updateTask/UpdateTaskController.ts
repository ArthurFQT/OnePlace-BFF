import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { Controller, Patch, Tags } from '@/shared/http/docs/decorators';

import { UpdateTaskUseCase } from './UpdateTaskUseCase';

@Tags('Tasks')
@Controller('/tasks')
export class UpdateTaskController {
  @Patch(':id')
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const useCase = container.resolve(UpdateTaskUseCase);
    const result = await useCase.execute(id, req.body as any);
    return res.json(result);
  }
}
