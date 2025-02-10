import { z } from 'zod';
import { Types } from 'mongoose';

const objectIdValidation = (val: string) => Types.ObjectId.isValid(val);

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório').trim(),
  description: z.string().trim().optional(),
  userId: z
    .string()
    .refine(objectIdValidation, { message: 'ID de usuário inválido' }),
});

export const updateTaskStatusSchema = z.object({
  status: z.enum(['pendente', 'em progresso', 'concluída']),
});
