import express, { Application } from 'express';
import dotenv from 'dotenv';
import { connectToDatabase } from './config/database';
import { EnvValidator } from './utils/envValidator';
import mongoose from 'mongoose';
import { registerRoutes } from './routes';
import { errorHandler } from './middlewares/errorHandler';

dotenv.config();

class Server {
  private app: Application;
  private port: number;

  constructor() {
    this.app = express();

    const env = EnvValidator.validate(['MONGODB_URI', 'PORT']);
    this.port = Number(env.PORT);

    this.initializeMiddlewares();
    this.initializeRoutes();
  }

  private async initializeDatabase(): Promise<void> {
    try {
      await connectToDatabase();
    } catch {
      process.exit(1);
    }
  }

  private initializeMiddlewares(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(errorHandler);
  }

  private initializeRoutes(): void {
    registerRoutes(this.app);
  }

  public start(): void {
    this.initializeDatabase();
    const server = this.app.listen(this.port, () => {
      console.log(`Servidor rodando na porta ${this.port}`);
    });

    process.on('SIGINT', () => {
      console.info('\nRecebido SIGINT. Encerrando servidor...');
      server.close(() => {
        mongoose.connection
          .close()
          .then(() => {
            console.info('Servidor e conexão com MongoDB encerrados');
            process.exit(0);
          })
          .catch((error) => {
            console.error('Erro ao encerrar a conexão com MongoDB', error);
            process.exit(1);
          });
      });
    });
  }
}

try {
  const server = new Server();
  server.start();
} catch {
  process.exit(1);
}
