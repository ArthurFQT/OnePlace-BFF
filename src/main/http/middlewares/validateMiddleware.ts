import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';

import { AppError } from '@/shared/core/errors/AppError';

export function validateDto(dtoClass: any) {
  return async (req: Request, _: Response, next: NextFunction) => {
    const dto = plainToInstance(dtoClass, req.body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      const messages = errors.flatMap(err =>
        err.constraints ? Object.values(err.constraints) : ['Erro de validação genérico'],
      );
      throw new AppError(messages.join(', '), 422, 'validation');
    }

    return next();
  };
}
