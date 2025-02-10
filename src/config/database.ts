import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectToDatabase = async (): Promise<void> => {
  const connection = process.env.MONGODB_URI;

  if (!connection) {
    throw new Error('MONGODB_URI não foi definida no arquivo .env');
  }

  try {
    await mongoose.connect(connection);
  } catch (error) {
    console.error('Falha na inicialização do banco de dados:', error);
    process.exit(1);
  }
};
