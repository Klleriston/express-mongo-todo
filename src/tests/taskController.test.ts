import request from 'supertest';
import express, { Application } from 'express';
import { NotFoundError, ValidationError } from '../errors/customErrors';
import { TaskController } from '../controllers/task/task.controller';
import { TaskService } from '../service/task/task.service';

jest.mock('../service/task/task.service.ts');

const app: Application = express();
app.use(express.json());

app.post('/tasks', TaskController.createTask);
app.get('/tasks', TaskController.getTasks);
app.get('/tasks/:id', TaskController.getTaskById);
app.patch('/tasks/:id/status', TaskController.updateTaskStatus);
app.delete('/tasks/:id', TaskController.deleteTask);

describe('TaskController', () => {
  const mockTask = {
    _id: 'task_id',
    title: 'Test Task',
    status: 'pendente',
    userId: 'user_id'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /tasks', () => {
    it('deve criar uma tarefa com status 201', async () => {
      (TaskService.createTask as jest.Mock).mockResolvedValue(mockTask);

      const response = await request(app)
        .post('/tasks')
        .send(mockTask);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockTask);
    });
  });

  describe('GET /tasks', () => {
    it('deve retornar lista de tarefas com paginação', async () => {
      const mockTasks = [mockTask];
      (TaskService.getAllTasks as jest.Mock).mockResolvedValue({
        tasks: mockTasks,
        total: 1
      });

      const response = await request(app)
        .get('/tasks')
        .query({ page: 1, limit: 10 });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        tasks: mockTasks,
        total: 1,
        page: 1,
        limit: 10
      });
    });

    it('deve filtrar tarefas por usuário', async () => {
      const mockTasks = [mockTask];
      (TaskService.getTasksByUser as jest.Mock).mockResolvedValue({
        tasks: mockTasks,
        total: 1
      });

      const response = await request(app)
        .get('/tasks')
        .query({ userId: 'user_id' });

      expect(response.status).toBe(200);
      expect(TaskService.getTasksByUser).toHaveBeenCalledWith('user_id', 1, 10);
    });
  });

  describe('GET /tasks/:id', () => {
    it('deve retornar uma tarefa pelo ID', async () => {
      (TaskService.getTaskById as jest.Mock).mockResolvedValue(mockTask);

      const response = await request(app).get('/tasks/task_id');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockTask);
    });
  });

  describe('PATCH /tasks/:id/status', () => {
    it('deve atualizar o status da tarefa', async () => {
      const updatedTask = { ...mockTask, status: 'concluída' };
      (TaskService.updateTaskStatus as jest.Mock).mockResolvedValue(updatedTask);

      const response = await request(app)
        .patch('/tasks/task_id/status')
        .send({ status: 'concluída' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedTask);
    });
  });

  describe('DELETE /tasks/:id', () => {
    it('deve deletar uma tarefa com status 204', async () => {
      (TaskService.deleteTask as jest.Mock).mockResolvedValue(true);

      const response = await request(app).delete('/tasks/task_id');
      expect(response.status).toBe(204);
    });
  });

  describe('Error Handling', () => {
    it('deve retornar 404 para tarefa não encontrada', async () => {
      (TaskService.getTaskById as jest.Mock).mockRejectedValue(
        new NotFoundError('Tarefa')
      );

      const response = await request(app).get('/tasks/invalid_id');
      expect(response.status).toBe(404);
    });

    it('deve retornar 400 para dados inválidos', async () => {
      (TaskService.createTask as jest.Mock).mockRejectedValue(
        new ValidationError('Erro de validação')
      );

      const response = await request(app)
        .post('/tasks')
        .send({ invalidField: 'test' });

      expect(response.status).toBe(400);
    });
  });
});
