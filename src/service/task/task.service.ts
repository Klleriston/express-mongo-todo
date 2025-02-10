import { Types } from 'mongoose';
import { NotFoundError, ValidationError } from '../../errors/customErrors';
import { ITask } from '../../interfaces/types/tasks.types';
import { Task } from '../../models/task/task.models';

export class TaskService {
  static async createTask(taskData: ITask): Promise<ITask> {
    if (!Types.ObjectId.isValid(taskData.userId)) {
      throw new ValidationError('ID de usuário inválido.');
    }
    if (!taskData.title) {
      throw new ValidationError('O título da tarefa é obrigatório.');
    }
    return Task.create(taskData);
  }

  static async getAllTasks(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ tasks: ITask[]; total: number }> {
    if (page < 1 || limit < 1)
      throw new ValidationError('Parâmetros de paginação inválidos');
    const skip = (page - 1) * limit;

    const [tasks, total] = await Promise.all([
      Task.find().skip(skip).limit(limit),
      Task.countDocuments(),
    ]);

    return { tasks, total };
  }

  static async getTaskById(id: string): Promise<ITask> {
    const task = await Task.findById(id);
    if (!task) throw new NotFoundError('Tarefa');
    return task;
  }

  static async updateTaskStatus(id: string, status: string): Promise<ITask> {
    const task = await Task.findByIdAndUpdate(id, { status }, { new: true });
    if (!task) throw new NotFoundError('Tarefa');
    return task;
  }

  static async deleteTask(id: string): Promise<void> {
    const task = await Task.findByIdAndDelete(id);
    if (!task) throw new NotFoundError('Tarefa');
  }

  static async getTasksByUser(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ tasks: ITask[]; total: number }> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new ValidationError('ID de usuário inválido');
    }

    const skip = (page - 1) * limit;

    const [tasks, total] = await Promise.all([
      Task.find({ userId }).skip(skip).limit(limit),
      Task.countDocuments({ userId }),
    ]);

    return { tasks, total };
  }
}
