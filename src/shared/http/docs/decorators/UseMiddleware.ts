import { METADATA_KEYS } from './metadataKeys';
import { Middleware } from './types';

export function UseMiddleware(...middlewares: Middleware[]): MethodDecorator {
  return (target, key, descriptor) => {
    Reflect.defineMetadata(METADATA_KEYS.MIDDLEWARES, middlewares, descriptor.value!);
  };
}
