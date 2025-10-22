import 'reflect-metadata';

import { METADATA_KEYS } from '@/shared/http/docs/decorators/metadataKeys';

export function ApiProperty(): PropertyDecorator {
  return (target, propertyKey) => {
    const existingProps: (string | symbol)[] =
      Reflect.getMetadata(METADATA_KEYS.API_PROPERTIES, target) || [];

    Reflect.defineMetadata(
      METADATA_KEYS.API_PROPERTIES,
      [...new Set([...existingProps, propertyKey])],
      target,
    );
  };
}
