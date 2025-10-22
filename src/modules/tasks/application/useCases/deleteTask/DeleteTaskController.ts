import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { Controller, Delete, Tags } from '@/shared/http/docs/decorators';

import { DeleteTaskUseCase } from './DeleteTaskUseCase';

@Tags('Tasks')
@Controller('/tasks')
export class DeleteTaskController {
  @Delete(':id')
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const useCase = container.resolve(DeleteTaskUseCase);
    await useCase.execute(id);
    return res.status(204).send();
  }
}
