import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodSchema } from 'zod';

export const validate =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      res
        .status(400)
        .json({
          message: 'Erro de validação',
          errors: (error as ZodError).errors,
        });
    }
  };
