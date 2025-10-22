import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

export function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ message: 'TOKEN MISSING' });

  const [, token] = authHeader.split(' ');

  try {
    const decoded = verify(token, process.env.JWT_SECRET!);
    req.user = {
      id: (decoded as any).sub,
      email: (decoded as any).email,
    };
    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
}
