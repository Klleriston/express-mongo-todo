import { Schema, model } from 'mongoose';
import { ITask } from '../../interfaces/types/tasks.types';

const taskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: ['pendente', 'em progresso', 'concluída'],
      default: 'pendente',
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
);

export const Task = model<ITask>('Task', taskSchema);
