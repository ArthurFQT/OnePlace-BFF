import { HttpErrorResponse } from '@/shared/core/dtos/HttpErrorResponse';

import { ApiResponse } from './ApiResponse';

export function CommonResponses(): MethodDecorator {
  return (target, propertyKey, descriptor) => {
    ApiResponse({
      statusCode: 400,
      description: 'Requisição mal formada',
      dtoClass: HttpErrorResponse,
    })(target, propertyKey, descriptor);
    ApiResponse({ statusCode: 401, description: 'Não autorizado', dtoClass: HttpErrorResponse })(
      target,
      propertyKey,
      descriptor,
    );
    ApiResponse({
      statusCode: 500,
      description: 'Erro interno no servidor',
      dtoClass: HttpErrorResponse,
    })(target, propertyKey, descriptor);
  };
}
