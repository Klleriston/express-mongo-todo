import { Application } from 'express';
import UserRouter from './users/user.routes';

export const registerRoutes = (app: Application): void => {
  app.use('/api/user', UserRouter);
};
