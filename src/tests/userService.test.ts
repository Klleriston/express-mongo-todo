import { User } from '../models/user/user.model';
import { UserService } from '../service/user/user.service';
import { ValidationError, NotFoundError } from '../errors/customErrors';
import bcrypt from 'bcrypt';
import { UserCreationData } from '../interfaces/types/userCreationData.types';
import { IUser } from '../interfaces/types/user.types';

jest.mock('../models/user/user.model.ts');
jest.mock('bcrypt');

describe('UserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    const mockUserData: UserCreationData = {
      name: 'Test',
      email: 'test@email.com',
      password: 'hashed_password',
    };

    it('deve lançar ValidationError se o email já estiver em uso', async () => {
      (User.findOne as jest.Mock).mockResolvedValue({
        email: 'test@email.com',
      });

      await expect(UserService.createUser(mockUserData as IUser)).rejects.toThrow(
        ValidationError,
      );
      expect(User.findOne).toHaveBeenCalledWith({ email: mockUserData.email });
    });

    it('deve criar um usuário com sucesso', async () => {
      const hashedPassword = 'hashed_password';
      const mockCreatedUser = {
        _id: 'user_id',
        ...mockUserData,
        password: hashedPassword,
      };

      (User.findOne as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      (User.create as jest.Mock).mockResolvedValue(mockCreatedUser);

      const user = await UserService.createUser(mockUserData as IUser);

      expect(user).toEqual(mockCreatedUser);
      expect(bcrypt.hash).toHaveBeenCalledWith(mockUserData.password, 10);
      expect(User.create).toHaveBeenCalledWith({
        ...mockUserData,
        password: hashedPassword,
      });
    });

    it('deve propagar erros do bcrypt', async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockRejectedValue(new Error('Bcrypt error'));

      await expect(UserService.createUser(mockUserData as IUser)).rejects.toThrow(
        'Bcrypt error',
      );
    });
  });

  describe('getAllUsers', () => {
    it('deve retornar lista de usuários com paginação', async () => {
      const mockUsers = [
        { _id: '1', name: 'User 1' },
        { _id: '2', name: 'User 2' },
      ];
      const mockTotal = 10;

      (User.find as jest.Mock).mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue(mockUsers),
        }),
      });
      (User.countDocuments as jest.Mock).mockResolvedValue(mockTotal);

      const result = await UserService.getAllUsers(2, 5);

      expect(result).toEqual({ users: mockUsers, total: mockTotal });
      expect(User.find).toHaveBeenCalled();
      expect(User.countDocuments).toHaveBeenCalled();
    });
  });

  describe('getUserById', () => {
    it('deve lançar NotFoundError se o usuário não for encontrado', async () => {
      (User.findById as jest.Mock).mockResolvedValue(null);

      await expect(UserService.getUserById('invalid_id')).rejects.toThrow(
        NotFoundError,
      );
      expect(User.findById).toHaveBeenCalledWith('invalid_id');
    });

    it('deve retornar um usuário pelo ID', async () => {
      const mockUser = {
        _id: 'user_id',
        name: 'Test',
        email: 'test@email.com',
      };
      (User.findById as jest.Mock).mockResolvedValue(mockUser);

      const user = await UserService.getUserById('user_id');

      expect(user).toEqual(mockUser);
      expect(User.findById).toHaveBeenCalledWith('user_id');
    });
  });

  describe('updateUser', () => {
    const updateData = { name: 'Updated Test' };

    it('deve atualizar um usuário com sucesso', async () => {
      const mockUpdatedUser = { _id: 'user_id', ...updateData };
      (User.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockUpdatedUser);

      const user = await UserService.updateUser('user_id', updateData);

      expect(user).toEqual(mockUpdatedUser);
      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
        'user_id',
        updateData,
        { new: true },
      );
    });

    it('deve lançar NotFoundError ao tentar atualizar um usuário inexistente', async () => {
      (User.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

      await expect(
        UserService.updateUser('invalid_id', updateData),
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('deleteUser', () => {
    it('deve deletar um usuário com sucesso', async () => {
      const mockDeletedUser = { _id: 'user_id' };
      (User.findByIdAndDelete as jest.Mock).mockResolvedValue(mockDeletedUser);

      await UserService.deleteUser('user_id');

      expect(User.findByIdAndDelete).toHaveBeenCalledWith('user_id');
    });

    it('deve lançar NotFoundError ao tentar deletar um usuário inexistente', async () => {
      (User.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

      await expect(UserService.deleteUser('invalid_id')).rejects.toThrow(
        NotFoundError,
      );
    });
  });
});
