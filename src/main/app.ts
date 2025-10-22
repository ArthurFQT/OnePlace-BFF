import '@/shared/providers/typeorm';

import cors from 'cors';
import express, { Application } from 'express';
import { engine } from 'express-handlebars';
import helmet from 'helmet';
import path from 'path';
import pino from 'pino-http';
import swaggerUi from 'swagger-ui-express';

import { loggerMiddleware } from '@/main/http/middlewares/loggerMiddleware';
import { tracerMiddleware } from '@/main/http/middlewares/tracerMiddleware';
import swaggerDocument from '@/shared/http/docs/swagger.json';

export class App {
  private app: Application;

  constructor() {
    this.app = express();

    this.setupViewEngine();

    this.setupMiddlewares();
    this.setupDocs();
  }

  private setupViewEngine(): void {
    this.app.set('views', path.join(__dirname, '..', 'shared', 'providers', 'mail', 'templates'));
    this.app.engine(
      'hbs',
      engine({
        extname: '.hbs',
        defaultLayout: false,
      }),
    );
    this.app.set('view engine', 'hbs');
  }

  private setupMiddlewares(): void {
    this.app.use(tracerMiddleware);
    this.app.use(loggerMiddleware);
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(pino());
  }

  private setupDocs(): void {
    this.app.get('/docs/swagger.json', (req, res) => {
      if (swaggerDocument) {
        return res.json(swaggerDocument);
      } else {
        res.status(404).json({ error: 'Swagger file not found' });
      }
    });
    this.app.use(
      '/docs',
      swaggerUi.serve as any,
      swaggerUi.setup(swaggerDocument, {
        swaggerOptions: {
          url: '/docs/swagger.json',
        },
        swaggerUrls: [
          {
            url: '/docs/swagger.json',
            name: 'API DOCS',
            description: 'Documentação da API',
          },
        ],
        customSiteTitle: 'API DOCS',
      }) as any,
    );
  }

  public getApp(): Application {
    return this.app;
  }
}

export default new App().getApp();
