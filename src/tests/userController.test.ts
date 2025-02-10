import request from 'supertest';
import express, { Application } from 'express';
import { UserService } from '../service/user/user.service';
import { UserController } from '../controllers/user/user.controller';

jest.mock('../service/user/user.service');

const app: Application = express();
app.use(express.json());

app.post('/users', UserController.createUser);
app.get('/users', UserController.getUsers);
app.get('/users/:id', UserController.getUserById);
app.put('/users/:id', UserController.updateUser);
app.delete('/users/:id', UserController.deleteUser);

describe('UserController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve criar um usuário com sucesso', async () => {
    const mockUser = {
      _id: 'user_id',
      name: 'Test User',
      email: 'test@email.com',
      password: 'hashed_password',
    };

    (UserService.createUser as jest.Mock).mockResolvedValue(mockUser);

    const response = await request(app)
      .post('/users')
      .send({ name: 'Test User', email: 'test@email.com', password: '123456' });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(mockUser);
    expect(UserService.createUser).toHaveBeenCalledWith({
      name: 'Test User',
      email: 'test@email.com',
      password: '123456',
    });
  });

  it('deve retornar uma lista de usuários', async () => {
    const mockUsers = [
      { _id: 'user1', name: 'User One', email: 'user1@email.com' },
      { _id: 'user2', name: 'User Two', email: 'user2@email.com' },
    ];

    (UserService.getAllUsers as jest.Mock).mockResolvedValue({
      users: mockUsers,
      total: 2,
    });

    const response = await request(app).get('/users');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      users: mockUsers,
      total: 2,
      page: 1,
      limit: 10,
    });
    expect(UserService.getAllUsers).toHaveBeenCalledWith(1, 10);
  });

  it('deve retornar um usuário pelo ID', async () => {
    const mockUser = {
      _id: 'user_id',
      name: 'Test User',
      email: 'test@email.com',
    };

    (UserService.getUserById as jest.Mock).mockResolvedValue(mockUser);

    const response = await request(app).get('/users/user_id');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockUser);
    expect(UserService.getUserById).toHaveBeenCalledWith('user_id');
  });

  it('deve atualizar um usuário com sucesso', async () => {
    const updatedMockUser = { _id: 'user_id', name: 'Updated User' };

    (UserService.updateUser as jest.Mock).mockResolvedValue(updatedMockUser);

    const response = await request(app)
      .put('/users/user_id')
      .send({ name: 'Updated User' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(updatedMockUser);
    expect(UserService.updateUser).toHaveBeenCalledWith('user_id', {
      name: 'Updated User',
    });
  });

  it('deve deletar um usuário com sucesso', async () => {
    const userId = 'user_id';
    (UserService.deleteUser as jest.Mock).mockResolvedValue(userId);
    const response = await request(app).delete('/users/user_id');

    expect(response.status).toBe(204);
    expect(UserService.deleteUser).toHaveBeenCalledWith('user_id');
  });

  it('deve retornar erro ao tentar criar um usuário com email duplicado', async () => {
    (UserService.createUser as jest.Mock).mockRejectedValue(
      new Error('Email já está em uso.'),
    );

    const response = await request(app)
      .post('/users')
      .send({
        name: 'Test User',
        email: 'duplicate@email.com',
        password: '123456',
      });

    expect(response.status).toBe(500);
  });
});
