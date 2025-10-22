import 'reflect-metadata';
import 'tsconfig-paths/register';

import fs from 'fs';
import path from 'path';
import { exit } from 'process';

import { getAppInfo } from '@/shared/core/appInfo';
// import logger from '@/shared/core/logger';
import { METADATA_KEYS } from '@/shared/http/docs/decorators/metadataKeys';
import { getAllControllers } from '@/shared/http/docs/utils/getAllControllers';

import { inferExampleFromType } from './inferExampleFromType';

export async function generateSwagger() {
  const { name, version } = getAppInfo();
  const paths: Record<string, any> = {};
  const controllers = await getAllControllers();

  for (const ControllerClass of controllers) {
    const controllerInstance = new ControllerClass();
    const prototype = Object.getPrototypeOf(controllerInstance);

    const basePath: string = Reflect.getMetadata(METADATA_KEYS.CONTROLLER, ControllerClass);
    const tags = Reflect.getMetadata(METADATA_KEYS.TAGS, ControllerClass) || [];

    Object.getOwnPropertyNames(prototype).forEach(methodName => {
      if (methodName === 'constructor') return;

      const handler = prototype[methodName];

      const method = Reflect.getMetadata(METADATA_KEYS.METHOD, handler);
      const routePath = Reflect.getMetadata(METADATA_KEYS.PATH, handler);

      if (!method || !routePath) return;

      const fullPath = `/${basePath}/${routePath}`.replace(/\/+/g, '/');
      if (!paths[fullPath]) paths[fullPath] = {};

      // logger.info({
      //   message: '📚 Mapeando rota',
      //   method: method.toUpperCase(),
      //   fullPath,
      //   controller: ControllerClass.name,
      //   handler: methodName,
      // });

      // Responses
      const responsesMeta = Reflect.getMetadata(METADATA_KEYS.RESPONSES, handler) || [];
      const responses: Record<string, any> = {};
      for (const res of responsesMeta) {
        responses[res.statusCode] = {
          description: res.description,
          content: {
            'application/json': {
              example: res.example || (res.dtoClass && inferExampleFromType(res.dtoClass)) || {},
            },
          },
        };
      }

      // Headers
      const headersMeta = Reflect.getMetadata(METADATA_KEYS.HEADERS, handler) || [];
      const parameters = headersMeta.map((h: any) => ({
        name: h.name,
        in: 'header',
        required: h.required ?? false,
        description: h.description,
        schema: { type: 'string' },
      }));

      // Body
      const bodyMeta = Reflect.getMetadata(METADATA_KEYS.BODY, handler);
      const requestBody = bodyMeta
        ? {
            required: true,
            content: {
              'application/json': {
                example: inferExampleFromType(bodyMeta),
              },
            },
          }
        : undefined;

      // Auth
      const requiresAuth = Reflect.getMetadata(METADATA_KEYS.REQUIRES_AUTH, handler);

      const description = Reflect.getMetadata(METADATA_KEYS.DESCRIPTION, handler) || methodName;

      // Swagger path item
      paths[fullPath][method] = {
        tags,
        summary: description,
        parameters,
        requestBody,
        responses,
        ...(requiresAuth ? { security: [{ bearerAuth: [] }] } : {}),
      };
    });
  }

  const swaggerDoc = {
    openapi: '3.1.0',
    info: { title: name, version, description: 'API documentation' },
    paths,
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  };

  const outPath = path.resolve('src/shared/http/docs/swagger.json');
  fs.writeFileSync(outPath, JSON.stringify(swaggerDoc, null, 2));
   // logger.info(`✅ Swagger gerado com sucesso em ${outPath}`);
  exit(0);
}

generateSwagger();
