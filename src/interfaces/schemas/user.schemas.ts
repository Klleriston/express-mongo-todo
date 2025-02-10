import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(1, 'O nome é obrigatório.'),
  email: z.string().email('Email inválido.'),
  password: z.string().min(5, 'A senha deve ter pelo menos 5 caracteres.'),
});

export const updateUserSchema = z.object({
  name: z.string().optional(),
  email: z.string().email('Email inválido.').optional(),
  password: z.string().min(5, 'A senha deve ter pelo menos 5 caracteres.').optional(),
});
