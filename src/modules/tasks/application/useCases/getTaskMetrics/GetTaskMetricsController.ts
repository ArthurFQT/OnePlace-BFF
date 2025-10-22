import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { Controller, Get, Tags } from '@/shared/http/docs/decorators';

import { GetTaskMetricsUseCase } from './GetTaskMetricsUseCase';

@Tags('Tasks')
@Controller('/tasks')
export class GetTaskMetricsController {
  @Get('metrics')
  async handle(req: Request, res: Response): Promise<Response> {
    const useCase = container.resolve(GetTaskMetricsUseCase);
    const result = await useCase.getTasksByPeriod();
    return res.json(result);
  }

  @Get('metrics/custom')
  async custom(req: Request, res: Response): Promise<Response> {
    const { startDate, endDate } = req.query as any;
    const useCase = container.resolve(GetTaskMetricsUseCase);
    const result = await useCase.getCustomPeriodMetrics(new Date(startDate), new Date(endDate));
    return res.json(result);
  }
}
