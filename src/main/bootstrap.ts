import 'reflect-metadata';
import 'dotenv/config';

import { handleError } from '@/main/http/middlewares/handleError';
import { registerSharedProviders } from '@/shared/container';
import { registerRoutes } from '@/shared/http/docs/decorators/routes-loader';

import app from './app';

export async function bootstrap() {
  await registerSharedProviders();
  await registerRoutes(app);
  app.use(handleError);
  const PORT = process.env.PORT || 3333;

  const server = app.listen(PORT, () => {
    // console.log(`🔥 Server is running at http://localhost:${PORT}`);
  });

  process.on('SIGINT', () => {
    // console.log('🔌 Encerrando aplicação via SIGINT (Ctrl+C)...');
    shutdown(server);
  });

  process.on('SIGTERM', () => {
    // 🛑 Encerrando aplicação via SIGTERM...
    // Use a logging utility here if available, or remove this line to avoid console statements.
    shutdown(server);
  });

  process.on('uncaughtException', err => {
    // console.log({ err }, '💥 Exceção não capturada');
    process.exit(1);
  });

  process.on('unhandledRejection', reason => {
    // console.log({ reason }, '💥 Promessa rejeitada não tratada');
    process.exit(1);
  });
}

function shutdown(server: import('http').Server) {
  server.close(() => {
    // console.log('🧹 Servidor encerrado com sucesso.');
    process.exit(0);
  });
}
