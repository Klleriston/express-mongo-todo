import { Router } from 'express';
import { validate } from '../../middlewares/validate';
import {
  createUserSchema,
  updateUserSchema,
} from '../../interfaces/schemas/user.schemas';
import { UserController } from '../../controllers/user/user.controller';

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
