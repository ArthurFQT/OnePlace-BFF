import 'reflect-metadata';

import { METADATA_KEYS } from '@/shared/http/docs/decorators/metadataKeys';

export function Tags(...tags: string[]): ClassDecorator {
  return target => {
    Reflect.defineMetadata(METADATA_KEYS.TAGS, tags, target);
  };
}
