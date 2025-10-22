import 'reflect-metadata';
import 'dotenv/config';

import { registerSharedProviders } from '@/shared/container';
// import logger from '@/shared/core/logger';

export async function bootstrapWorker(workerName: string, start: () => Promise<void>) {
  await registerSharedProviders();
  try {
    // logger.info(`🚀 Iniciando worker [${workerName}]...`);

    await start();

    // logger.info(`✅ Worker [${workerName}] iniciado com sucesso.`);
  } catch (error) {
    // logger.fatal({ error }, `❌ Erro fatal ao iniciar worker [${workerName}]`);
    process.exit(1);
  }

  process.on('SIGINT', () => {
    // logger.warn(`🛑 Encerrando worker [${workerName}] via SIGINT`);
    shutdown();
  });

  process.on('SIGTERM', () => {
    // logger.warn(`🛑 Encerrando worker [${workerName}] via SIGTERM`);
    shutdown();
  });

  process.on('uncaughtException', err => {
    // logger.fatal({ err }, `💥 Exceção não capturada no worker [${workerName}]`);
    process.exit(1);
  });

  process.on('unhandledRejection', reason => {
    // logger.fatal({ reason }, `💥 Promessa rejeitada no worker [${workerName}]`);
    process.exit(1);
  });
}

function shutdown() {
  // logger.info('🧹 Finalizando recursos do worker...');
  process.exit(0);
}
