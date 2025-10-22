import 'reflect-metadata';

import { METADATA_KEYS } from '@/shared/http/docs/decorators/metadataKeys';

export function RequiresAuth(): MethodDecorator {
  return (_target, _propertyKey, descriptor) => {
    Reflect.defineMetadata(METADATA_KEYS.REQUIRES_AUTH, true, descriptor.value!);
  };
}
