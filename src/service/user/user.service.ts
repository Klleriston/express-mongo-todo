import { NotFoundError, ValidationError } from '../../errors/customErrors';
import { IUser } from '../../interfaces/types/user.types';
import { User } from '../../models/user/user.models';
import bcrypt  from 'bcrypt';


export class UserService {
  static async createUser(userData: IUser): Promise<IUser> {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) throw new ValidationError('Email já está em uso.');
    userData.password = await bcrypt.hash(userData.password, 10);

    return User.create(userData);
  }

  static async getAllUsers(page: number = 1, limit: number = 10): Promise<{ users: IUser[]; total: number }> {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      User.find().skip(skip).limit(limit),
      User.countDocuments(),
    ]);

    return { users, total };
  }

  static async getUserById(id: string): Promise<IUser> {
    const user = await User.findById(id);
    if (!user) throw new NotFoundError('Usuário não encontrado');
    
    return user;
  }

  static async updateUser(id: string, userData: Partial<IUser>): Promise<IUser> {
    const user = await User.findByIdAndUpdate(id, userData, { new: true });
    if (!user) throw new NotFoundError('Usuário não encontrado');

    return user;
  }

  static async deleteUser(id: string): Promise<void> {
    const user = await User.findByIdAndDelete(id);
    if (!user) throw new NotFoundError('Usuário não encontrado');
  }
}
