import express, { Application } from 'express';
import dotenv from 'dotenv';
import { connectToDatabase } from './config/database';
import { EnvValidator } from './utils/envValidator';
import mongoose from 'mongoose';
import { registerRoutes } from './routes';
import { errorHandler } from './middlewares/errorHandler';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';

dotenv.config();

class Server {
  private app: Application;
  private port: number;

  constructor() {
    this.app = express();

    const env = EnvValidator.validate(['MONGODB_URI', 'PORT']);
    this.port = Number(env.PORT);

    this.initializeDatabase().catch(() => {
      process.exit(1);
    });
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
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
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  }

  private initializeErrorHandling(): void {
    process.on('unhandledRejection', (reason: Error) => {
      console.error(`Unhandled Rejection: ${reason.message || reason}`);
      process.exit(1);
    });

    process.on('uncaughtException', (error: Error) => {
      console.error(`Uncaught Exception: ${error.message}`);
      process.exit(1);
    });
  }

  public start(): void {
    const server = this.app.listen(this.port, () => {
      console.log(`Servidor rodando na porta ${this.port}`);
    });

    process.on('SIGINT', () => {
      console.info('\nRecebido SIGINT. Encerrando servidor...');
      server.close(async () => {
        await mongoose.connection.close();
        console.info('Servidor e conexão com MongoDB encerrados');
        process.exit(0);
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
