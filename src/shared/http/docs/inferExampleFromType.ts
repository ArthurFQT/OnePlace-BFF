import 'reflect-metadata';

// import logger from '@/shared/core/logger';
import { METADATA_KEYS } from '@/shared/http/docs/decorators/metadataKeys';

export function inferExampleFromType(dtoClass: any): Record<string, any> {
  const prototype = dtoClass.prototype;
  const example: Record<string, any> = {};
  const propertyNames: string[] =
    Reflect.getMetadata(METADATA_KEYS.API_PROPERTIES, prototype) || [];

  // logger.info(`📦 DTO: ${dtoClass.name} | Props: ${propertyNames}`);

  for (const key of propertyNames) {
    const type = Reflect.getMetadata('design:type', prototype, key);

    if (!type) continue;

    switch (type.name) {
      case 'String':
        example[key] = 'string';
        break;
      case 'Number':
        example[key] = 1;
        break;
      case 'Boolean':
        example[key] = true;
        break;
      case 'Array':
        example[key] = [];
        break;
      case 'Object':
        example[key] = {};
        break;
      default:
        // se for uma classe decorada, gera o exemplo com recursividade
        try {
          example[key] = inferExampleFromType(type);
        } catch {
          example[key] = null;
        }
    }
  }

  return example;
}
