import { ApiHeader } from './ApiHeader';

export function CommonHeaders(): MethodDecorator {
  return (target, propertyKey, descriptor) => {
    ApiHeader({ name: 'x-igua-transaction-id', description: 'ID da transação', required: true })(
      target,
      propertyKey,
      descriptor,
    );
    ApiHeader({
      name: 'x-plataform',
      description: 'Plataforma que enviou a requisição',
      required: true,
    })(target, propertyKey, descriptor);
    ApiHeader({ name: 'x-app-version', description: 'Versão do app', required: true })(
      target,
      propertyKey,
      descriptor,
    );
    ApiHeader({ name: 'x-igua-user-ip', description: 'IP do usuário', required: true })(
      target,
      propertyKey,
      descriptor,
    );
  };
}
