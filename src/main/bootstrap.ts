import 'reflect-metadata';
import 'dotenv/config';

import { handleError } from '@/main/http/middlewares/handleError';
import { registerSharedProviders } from '@/shared/container';
import { registerRoutes } from '@/shared/http/docs/decorators/routes-loader';

import app from './app';

export async function bootstrap() {
  try {
    await registerSharedProviders();
    await registerRoutes(app);
    app.use(handleError);

    const PORT = process.env.PORT || 3333;

    const server = app.listen(PORT, () => {
      console.log(`🔥 Server is running at http://localhost:${PORT}`);
    });

    process.on('SIGINT', () => {
      console.log('🔌 Encerrando aplicação via SIGINT (Ctrl+C)...');
      shutdown(server);
    });

    process.on('SIGTERM', () => {
      console.log('🛑 Encerrando aplicação via SIGTERM...');
      shutdown(server);
    });

    process.on('uncaughtException', err => {
      console.error('💥 Exceção não capturada:', err);
      process.exit(1);
    });

    process.on('unhandledRejection', reason => {
      console.error('💥 Promessa rejeitada não tratada:', reason);
      process.exit(1);
    });
  } catch (error) {
    console.error('❌ Erro durante a inicialização da aplicação:', error);
    process.exit(1);
  }
}

function shutdown(server: import('http').Server) {
  server.close(() => {
    // console.log('🧹 Servidor encerrado com sucesso.');
    process.exit(0);
  });
}
