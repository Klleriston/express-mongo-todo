/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../errors/customErrors';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error(`[${new Date().toISOString()}] Erro:`, err);
  
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }
  
  if (err instanceof ZodError) {
    res.status(400).json({
      error: 'Erro de validação',
      details: err.errors.map(e => ({
        path: e.path.join('.'),
        message: e.message
      }))
    });
    return;
  }

  res.status(500).json({ 
    error: 'Erro interno no servidor',
    requestId: req.headers['x-request-id']
  });
};
