import { Router } from 'express';
import { validate } from '../middlewares/validate';
import {
  createUserSchema,
  updateUserSchema,
} from '../interfaces/schemas/user.schemas';
import { UserController } from '../controllers/user/user.controller';

 /**
   * @swagger
   * tags:
   *   name: Usuários
   *   description: Operações relacionadas aos usuários
   */

  /**
   * @swagger
   * /users:
   *   post:
   *     summary: Cria um novo usuário
   *     tags: [Usuários]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 example: João
   *               email:
   *                 type: string
   *                 example: joao@example.com
   *               password:
   *                 type: string
   *                 example: "12345"
   *     responses:
   *       201:
   *         description: Usuário criado com sucesso
   *       400:
   *         description: Erro de validação
   */

  /**
   * @swagger
   * /users:
   *   get:
   *     summary: Lista todos os usuários
   *     tags: [Usuários]
   *     responses:
   *       200:
   *         description: Lista de usuários retornada com sucesso
   *       404:
   *         description: Nenhum usuário encontrado
   */

  /**
   * @swagger
   * /users/{id}:
   *   get:
   *     summary: Retorna os detalhes de um usuário específico
   *     tags: [Usuários]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: ID do usuário a ser retornado
   *     responses:
   *       200:
   *         description: Detalhes do usuário retornados com sucesso
   *       404:
   *         description: Usuário não encontrado
   */

  /**
   * @swagger
   * /users/{id}:
   *   put:
   *     summary: Atualiza os dados de um usuário existente
   *     tags: [Usuários]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: ID do usuário a ser atualizado
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 example: João
   *               email:
   *                 type: string
   *                 example: joao@example.com
   *               password:
   *                 type: string
   *                 example: "12345"
   *     responses:
   *       200:
   *         description: Usuário atualizado com sucesso
   *       400:
   *         description: Erro de validação
   *       404:
   *         description: Usuário não encontrado
   */

  /**
   * @swagger
   * /users/{id}:
   *   delete:
   *     summary: Remove um usuário existente
   *     tags: [Usuários]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: ID do usuário a ser removido
   *     responses:
   *       200:
   *         description: Usuário removido com sucesso
   *       404:
   *         description: Usuário não encontrado
   */
export class UserRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      '/',
      validate(createUserSchema),
      UserController.createUser,
    );
    this.router.get('/', UserController.getUsers);
    this.router.get('/:id', UserController.getUserById);
    this.router.put(
      '/:id',
      validate(updateUserSchema),
      UserController.updateUser,
    );
    this.router.delete('/:id', UserController.deleteUser);
  }
}

export default new UserRouter().router;
