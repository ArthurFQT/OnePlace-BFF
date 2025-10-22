import 'reflect-metadata';

import { METADATA_KEYS } from '@/shared/http/docs/decorators/metadataKeys';

export function Body(dtoClass: any): MethodDecorator {
  return (_target, _propertyKey, descriptor) => {
    Reflect.defineMetadata(METADATA_KEYS.BODY, dtoClass, descriptor.value!);
  };
}
