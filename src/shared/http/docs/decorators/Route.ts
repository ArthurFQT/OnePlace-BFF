// shared/http/decorators/Route.ts
import 'reflect-metadata';

import { METADATA_KEYS } from './metadataKeys';
import { HTTPMethod } from './types';

export function Route(method: HTTPMethod, path: string): MethodDecorator {
  return (target, propertyKey, descriptor: any) => {
    Reflect.defineMetadata(METADATA_KEYS.METHOD, method, descriptor.value);
    Reflect.defineMetadata(METADATA_KEYS.PATH, path, descriptor.value);
  };
}
