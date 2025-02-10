import { Router } from 'express';
import userRoutes from './user.routes';
import tasksRoutes from './tasks.routes';

export const registerRoutes = (app: Router): void => {
  app.use('/users', userRoutes);
  app.use('/tasks', tasksRoutes);
};
