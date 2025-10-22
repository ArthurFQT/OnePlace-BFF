import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { Controller, Get, Tags } from '@/shared/http/docs/decorators';

import { CheckHealthUseCase } from './CheckHealthUseCase';

@Tags('Health')
@Controller('/')
export class CheckHealthController {
  @Get('health')
  async handle(req: Request, res: Response): Promise<Response> {
    const useCase = container.resolve(CheckHealthUseCase);
    const result = await useCase.execute();
    return res.json(result);
  }
}
