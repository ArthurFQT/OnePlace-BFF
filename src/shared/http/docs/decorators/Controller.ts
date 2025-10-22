// shared/http/decorators/Controller.ts
import 'reflect-metadata';

import { METADATA_KEYS } from './metadataKeys';

export function Controller(basePath: string): ClassDecorator {
  return (target: any) => {
    Reflect.defineMetadata(METADATA_KEYS.CONTROLLER, basePath, target);
  };
}
