import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/customErrors";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.message });
  } else {
    console.error(err);
    res.status(500).json({ message: "Erro interno no servidor." });
  }
};
