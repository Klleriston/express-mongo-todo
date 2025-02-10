import { Request, Response, NextFunction } from 'express';
import { TaskService } from '../../service/task/task.service';

export class TaskController {
  static async createTask(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const task = await TaskService.createTask(req.body);
      res.status(201).json(task);
    } catch (error) {
      next(error);
    }
  }

  static async getTasks(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const userId = req.query.userId as string;

      let result;

      if (userId) {
        result = await TaskService.getTasksByUser(userId, page, limit);
      } else {
        result = await TaskService.getAllTasks(page, limit);
      }

      res.status(200).json({
        ...result,
        page,
        limit,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getTaskById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const task = await TaskService.getTaskById(req.params.id);
      res.status(200).json(task);
    } catch (error) {
      next(error);
    }
  }

  static async updateTaskStatus(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const task = await TaskService.updateTaskStatus(
        req.params.id,
        req.body.status,
      );
      res.status(200).json(task);
    } catch (error) {
      next(error);
    }
  }

  static async deleteTask(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      await TaskService.deleteTask(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
