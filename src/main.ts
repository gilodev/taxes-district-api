import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import { ValidationPipe } from '@nestjs/common';
import * as compression from 'compression';

let app: any;

async function bootstrap() {
  if (!app) {
    const expressApp = express();
    app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));

    // Compresse les réponses HTTP 
    app.use(
      compression({
        threshold: 1024, 
        level: 6, 
      }),
    );

    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ extended: true, limit: '50mb' }));

    const environment = process.env.NODE_ENV || 'development';

    // Configuration CORS dynamique à partir des variables d'environnement
    const allowedOrigins = (process.env.CORS_ORIGINS || '')
      .split(',')
      .filter((origin) => origin.trim() !== '');

    app.enableCors({
      origin: (origin, callback) => {
        // Si aucune origine n'est spécifiée ou en mode dev, autoriser
        if (
          !origin ||
          environment === 'development' ||
          allowedOrigins.length === 0
        ) {
          return callback(null, true);
        }

        if (allowedOrigins.indexOf(origin) === -1) {
          const msg = 'CORS policy violation: origin not allowed';
          return callback(new Error(msg), false);
        }

        return callback(null, true);
      },
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      allowedHeaders:
        'Content-Type, Authorization, Accept, Origin, X-Requested-With, X-API-Key',
      credentials: true,
      maxAge: 3600,
    });

    // Configuration globale des validations
    app.useGlobalPipes(
      new ValidationPipe({
        // Options de validation
        whitelist: true, 
        forbidNonWhitelisted: true, 
        transform: true, 
      }),
    );

    await app.init();
  }
  return app.getHttpAdapter().getInstance();
}

export default async function handler(req: any, res: any) {
  const server = await bootstrap();
  server(req, res);
}

// démarrage local
if (require.main === module) {
  bootstrap().then((server) => {
    const port = process.env.PORT || 3000;
    server.listen(port, () => {
      console.log(`Application is running on: http://localhost:${port}`);
    });
  });
}
