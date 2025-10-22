import { METADATA_KEYS } from './metadataKeys';
import { Guard } from './types';

export function UseGuard(...guards: Guard[]): MethodDecorator {
  return (target, key, descriptor) => {
    Reflect.defineMetadata(METADATA_KEYS.GUARDS, guards, descriptor.value!);
  };
}
