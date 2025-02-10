import express from 'express';
import { validate } from '../middlewares/validate';
import {
  createTaskSchema,
  updateTaskStatusSchema,
} from '../interfaces/schemas/task.schemas';
import { TaskController } from '../controllers/task/task.controller';

/**
 * @swagger
 * tags:
 *   name: Tarefas
 *   description: Operações relacionadas às tarefas
 *
 * @swagger
 * /tasks:
 *   post:
 *     summary: Cria uma nova tarefa
 *     tags: [Tarefas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       201:
 *         description: Tarefa criada com sucesso
 *       400:
 *         description: Erro de validação
 *
 * @swagger
 * /tasks:
 *   get:
 *     summary: Lista todas as tarefas
 *     tags: [Tarefas]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número da página para paginação
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 10
 *         description: Quantidade de itens por página
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: ID do usuário para filtrar tarefas específicas
 *     responses:
 *       200:
 *         description: Lista de tarefas retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tasks:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Task'
 *                 total:
 *                   type: integer
 *                   description: Total de tarefas encontradas
 *                 page:
 *                   type: integer
 *                   description: Página atual
 *                 limit:
 *                   type: integer
 *                   description: Quantidade de itens por página
 *       400:
 *         description: Erro de validação nos parâmetros
 *       404:
 *         description: Nenhuma tarefa encontrada
 *
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Retorna os detalhes de uma tarefa pelo ID
 *     tags: [Tarefas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da tarefa
 *     responses:
 *       200:
 *         description: Detalhes da tarefa retornados com sucesso
 *       404:
 *         description: Tarefa não encontrada
 *
 * @swagger
 * /tasks/{id}/status:
 *   patch:
 *     summary: Atualiza o status de uma tarefa
 *     tags: [Tarefas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da tarefa
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pendente, em progresso, concluída]
 *     responses:
 *       200:
 *         description: Status da tarefa atualizado com sucesso
 *       400:
 *         description: Erro de validação
 *       404:
 *         description: Tarefa não encontrada
 *
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Remove uma tarefa existente
 *     tags: [Tarefas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da tarefa
 *     responses:
 *       204:
 *         description: Tarefa removida com sucesso
 *       404:
 *         description: Tarefa não encontrada
 *
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - title
 *         - userId
 *       properties:
 *         title:
 *           type: string
 *           description: Título da tarefa
 *         description:
 *           type: string
 *           description: Descrição detalhada da tarefa
 *         status:
 *           type: string
 *           enum: [pendente, em progresso, concluída]
 *           default: pendente
 *           description: Status atual da tarefa
 *         userId:
 *           type: string
 *           description: ID do usuário responsável pela tarefa
 */
export class TaskRouter {
  public router: express.Router;

  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      '/',
      validate(createTaskSchema),
      TaskController.createTask,
    );
    this.router.get('/', TaskController.getTasks);
    this.router.get('/:id', TaskController.getTaskById);
    this.router.patch(
      '/:id/status',
      validate(updateTaskStatusSchema),
      TaskController.updateTaskStatus,
    );
    this.router.delete('/:id', TaskController.deleteTask);
  }
}

export default new TaskRouter().router;
