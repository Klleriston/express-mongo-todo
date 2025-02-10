import { model, Schema } from 'mongoose';
import { IUser } from '../../interfaces/types/user.types';

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true } 
);

export const User = model<IUser>('User', userSchema);