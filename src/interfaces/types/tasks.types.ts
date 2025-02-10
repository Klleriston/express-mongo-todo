import { Types } from 'mongoose';

export interface ITask extends Document {
  title: string;
  description?: string;
  status: 'pendente' | 'em progresso' | 'concluída';
  userId: Types.ObjectId;
}
