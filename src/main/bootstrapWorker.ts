import 'reflect-metadata';
import 'dotenv/config';

import { registerSharedProviders } from '@/shared/container';

export async function bootstrapWorker(workerName: string, start: () => Promise<void>) {
  try {
    // Inicializa dependências compartilhadas (ex: TypeORM, Redis, etc.)
    await registerSharedProviders();

    console.log(`🚀 Iniciando worker [${workerName}]...`);
    await start();
    console.log(`✅ Worker [${workerName}] iniciado com sucesso.`);
  } catch (error) {
    console.error(`❌ Erro ao iniciar worker [${workerName}]:`, error);
    process.exit(1);
  }

  // Handlers de encerramento
  process.on('SIGINT', () => {
    console.log(`🛑 Encerrando worker [${workerName}] via SIGINT`);
    shutdown(workerName);
  });

  process.on('SIGTERM', () => {
    console.log(`🛑 Encerrando worker [${workerName}] via SIGTERM`);
    shutdown(workerName);
  });

  process.on('uncaughtException', err => {
    console.error(`💥 Exceção não capturada no worker [${workerName}]`, err);
    process.exit(1);
  });

  process.on('unhandledRejection', reason => {
    console.error(`💥 Promessa rejeitada não tratada no worker [${workerName}]`, reason);
    process.exit(1);
  });
}

function shutdown(workerName: string) {
  console.log(`🧹 Finalizando recursos do worker [${workerName}]...`);
  // Aqui você pode encerrar conexões, filas etc., antes de sair:
  // await dataSource.destroy();
  process.exit(0);
}
