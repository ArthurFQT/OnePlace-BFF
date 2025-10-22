import express, { NextFunction, Request, Response } from 'express';

import { METADATA_KEYS } from '@/shared/http/docs/decorators/metadataKeys';
import { getAllControllers } from '@/shared/http/docs/utils/getAllControllers';

type Middleware = (req: Request, res: Response, next: NextFunction) => void;
type Guard = (req: Request) => boolean | Promise<boolean>;

export async function registerRoutes(app: express.Application) {
  const controllers = await getAllControllers();

  for (const Controller of controllers) {
    const basePath = Reflect.getMetadata(METADATA_KEYS.CONTROLLER, Controller);
    const tags = Reflect.getMetadata(METADATA_KEYS.TAGS, Controller) || [];
    const instance = new Controller();
    const prototype = Object.getPrototypeOf(instance);

    for (const key of Object.getOwnPropertyNames(prototype)) {
      const handler = prototype[key];
      if (typeof handler !== 'function') continue;

      const method = Reflect.getMetadata(METADATA_KEYS.METHOD, handler);
      const path = Reflect.getMetadata(METADATA_KEYS.PATH, handler);
      const middlewares: Middleware[] =
        Reflect.getMetadata(METADATA_KEYS.MIDDLEWARES, handler) || [];
      const guards: Guard[] = Reflect.getMetadata(METADATA_KEYS.GUARDS, handler) || [];

      if (method && path) {
        const routeHandler = async (req: Request, res: Response, next: NextFunction) => {
          try {
            for (const guard of guards) {
              const allowed = await guard(req);
              if (!allowed) {
                return res.status(403).json({ message: 'Acesso negado pelo guard' });
              }
            }
            await handler.call(instance, req, res, next);
          } catch (err) {
            next(err);
          }
        };

        const fullPath = `/${basePath}/${path}`.replace(/\/+/g, '/');
        app[method](fullPath, ...middlewares, routeHandler);

        console.log(
          `✅ Controller loaded: [${method.toUpperCase()}] ${fullPath} (${tags.join(', ')})`,
        );
      }
    }
  }
}
