// @/shared/http/docs/decorators/description.ts
import { METADATA_KEYS } from './metadataKeys';

export function Description(text: string) {
  return function (target: any, propertyKey: string) {
    Reflect.defineMetadata(METADATA_KEYS.DESCRIPTION, text, target[propertyKey]);
  };
}
