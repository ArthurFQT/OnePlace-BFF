import 'reflect-metadata';

import { METADATA_KEYS } from '@/shared/http/docs/decorators/metadataKeys';

interface ApiHeaderOptions {
  name: string;
  description?: string;
  required?: boolean;
}

export function ApiHeader(options: ApiHeaderOptions): MethodDecorator {
  return (_target, _propertyKey, descriptor) => {
    const existingHeaders = Reflect.getMetadata(METADATA_KEYS.HEADERS, descriptor.value!) || [];

    Reflect.defineMetadata(METADATA_KEYS.HEADERS, [...existingHeaders, options], descriptor.value!);
  };
}
