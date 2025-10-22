import { NextFunction, Request, Response } from 'express';

// import logger from '@/shared/core/logger';
import { getTracer } from '@/shared/core/tracer';

export function loggerMiddleware(req: Request, res: Response, next: NextFunction): void {
  const originalSend = res.send;
  let responseBody: any;

  res.send = function (body: any): Response {
    responseBody = body;
    res.send = originalSend;
    return res.send(body);
  };

  res.on('finish', () => {
    const tracerData = getTracer();

  //   logger.info({
  //     message: `Request finalizada: ${req.method} ${req.originalUrl}`,
  //     route: req.originalUrl,
  //     method: req.method,
  //     request: {
  //       headers: req.headers,
  //       body: req.body,
  //       query: req.query,
  //       params: req.params,
  //     },
  //     response: {
  //       statusCode: res.statusCode,
  //       data: tryParseJSON(responseBody),
  //     },
  //     tracer: tracerData
  //       ? {
  //           transactionId: tracerData.get('transactionId'),
  //           platform: tracerData.get('platform'),
  //           platformVersion: tracerData.get('platformVersion'),
  //           sessionId: tracerData.get('sessionId'),
  //           ip: tracerData.get('ip'),
  //         }
  //       : {},
  //   });
  });

  next();
}

function tryParseJSON(data: any): any {
  try {
    return typeof data === 'string' ? JSON.parse(data) : data;
  } catch {
    return data;
  }
}
