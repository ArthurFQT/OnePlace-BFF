export function ApiError(
  statusCode: number,
  message: string,
  type: 'validation' | 'auth' | 'infra' = 'infra',
): MethodDecorator {
  return (target, propertyKey) => {
    const existingResponses = Reflect.getMetadata('api:responses', target, propertyKey) || [];

    const dtoMock = {
      status: statusCode,
      message,
      type,
    };

    Reflect.defineMetadata(
      'api:responses',
      [
        ...existingResponses,
        {
          statusCode,
          dtoClass: dtoMock,
          description: message,
          isError: true,
        },
      ],
      target,
      propertyKey,
    );
  };
}
