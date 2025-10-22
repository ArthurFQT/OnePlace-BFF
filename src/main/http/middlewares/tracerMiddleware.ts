import { NextFunction, Request, Response } from 'express';

import { tracer } from '@/shared/core/tracer';

export function tracerMiddleware(req: Request, _: Response, next: NextFunction) {
  const store = new Map<string, any>();
  store.set('transactionId', req.headers['x-transaction-id'] || '');
  store.set('platform', req.headers['x-platform'] || 'unknown');
  store.set('platformVersion', req.headers['x-platform-version'] || 'unknown');
  store.set('sessionId', req.headers['x-session-id'] || '');
  store.set('ip', req.headers['x-ip'] || '');
  tracer.run(store, next);
}
