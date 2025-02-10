import { Types } from 'mongoose';
import { Task } from '../models/task/task.models';
import { TaskService } from '../service/task/task.service';
import { NotFoundError, ValidationError } from '../errors/customErrors';
import { TaskCreationData } from '../interfaces/types/taskCreationData.types';
import { ITask } from '../interfaces/types/tasks.types';

jest.mock('../models/task/task.models.ts');

describe('TaskService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createTask', () => {
    const mockTaskData: TaskCreationData = {
      title: 'Test Task',
      description: 'Test Description',
      userId: new Types.ObjectId().toString(),
    };

    it('deve criar uma tarefa com sucesso', async () => {
      const mockTask = { _id: 'task_id', ...mockTaskData };
      (Task.create as jest.Mock).mockResolvedValue(mockTask);

      const result = await TaskService.createTask(
        mockTaskData as unknown as ITask,
      );
      expect(result).toEqual(mockTask);
      expect(Task.create).toHaveBeenCalledWith(mockTaskData);
    });

    it('deve lançar ValidationError se o título estiver faltando', async () => {
      await expect(TaskService.createTask({} as ITask)).rejects.toThrow(
        ValidationError,
      );
    });
  });

  describe('getAllTasks', () => {
    it('deve retornar tarefas com paginação', async () => {
      const mockTasks = [{ _id: '1' }, { _id: '2' }];
      const mockTotal = 10;

      (Task.find as jest.Mock).mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockTasks),
      });
      (Task.countDocuments as jest.Mock).mockResolvedValue(mockTotal);

      const result = await TaskService.getAllTasks(2, 5);
      expect(result).toEqual({ tasks: mockTasks, total: mockTotal });
    });

    it('deve lançar ValidationError para parâmetros de paginação inválidos', async () => {
      await expect(TaskService.getAllTasks(0, 0)).rejects.toThrow(
        ValidationError,
      );
    });
  });

  describe('getTaskById', () => {
    it('deve retornar uma tarefa pelo ID', async () => {
      const mockTask = { _id: 'task_id' };
      (Task.findById as jest.Mock).mockResolvedValue(mockTask);

      const result = await TaskService.getTaskById('task_id');
      expect(result).toEqual(mockTask);
    });

    it('deve lançar NotFoundError se a tarefa não existir', async () => {
      (Task.findById as jest.Mock).mockResolvedValue(null);
      await expect(TaskService.getTaskById('invalid_id')).rejects.toThrow(
        NotFoundError,
      );
    });
  });

  describe('updateTaskStatus', () => {
    it('deve atualizar o status de uma tarefa', async () => {
      const mockTask = { _id: 'task_id', status: 'em progresso' };
      (Task.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockTask);

      const result = await TaskService.updateTaskStatus(
        'task_id',
        'em progresso',
      );
      expect(result).toEqual(mockTask);
    });

    it('deve lançar NotFoundError se a tarefa não existir', async () => {
      (Task.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);
      await expect(
        TaskService.updateTaskStatus('invalid_id', 'concluída'),
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('deleteTask', () => {
    it('deve deletar uma tarefa com sucesso', async () => {
      const mockTask = { _id: 'task_id' };
      (Task.findByIdAndDelete as jest.Mock).mockResolvedValue(mockTask);

      await TaskService.deleteTask('task_id');
      expect(Task.findByIdAndDelete).toHaveBeenCalledWith('task_id');
    });

    it('deve lançar NotFoundError se a tarefa não existir', async () => {
      (Task.findByIdAndDelete as jest.Mock).mockResolvedValue(null);
      await expect(TaskService.deleteTask('invalid_id')).rejects.toThrow(
        NotFoundError,
      );
    });
  });

  describe('getTasksByUser', () => {
    it('deve retornar tarefas filtradas por usuário', async () => {
      const userId = new Types.ObjectId().toString();
      const mockTasks = [{ _id: '1' }, { _id: '2' }];
      const mockTotal = 5;

      (Task.find as jest.Mock).mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockTasks),
      });
      (Task.countDocuments as jest.Mock).mockResolvedValue(mockTotal);

      const result = await TaskService.getTasksByUser(userId, 1, 10);
      expect(result).toEqual({ tasks: mockTasks, total: mockTotal });
    });

    it('deve lançar ValidationError para ID de usuário inválido', async () => {
      await expect(
        TaskService.getTasksByUser('invalid_id', 1, 10),
      ).rejects.toThrow(ValidationError);
    });
  });
});
