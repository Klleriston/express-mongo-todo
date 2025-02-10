import { Request, Response, NextFunction } from 'express';
import { UserService } from '../../service/user/user.service';

export class UserController {
  static async createUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const user = await UserService.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }

  static async getUsers(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const { users, total } = await UserService.getAllUsers(page, limit);
      res.status(200).json({ users, total, page, limit });
    } catch (error) {
      next(error);
    }
  }

  static async getUserById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const user = await UserService.getUserById(req.params.id);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  static async updateUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const user = await UserService.updateUser(req.params.id, req.body);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  static async deleteUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      await UserService.deleteUser(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
