import { NextFunction, Request, Response } from 'express';

import { getCache, setCache } from '@/shared/providers/redis/cacheHelper';

export function responseCache(ttl = 60) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const cacheKey = `route:${req.originalUrl}`;
    const cached = await getCache(cacheKey);

    if (cached) return res.json(cached);

    const originalJson = res.json.bind(res);

    const sendJson = async (body: any) => {
      await setCache(cacheKey, body, ttl);
      return originalJson(body);
    };

    res.json = (body: any) => {
      sendJson(body).catch(err => next(err));
      return res;
    };

    next();
  };
}
