import 'reflect-metadata';

import dotenv from 'dotenv';
dotenv.config();

import { bootstrapWorker } from '@/main/bootstrapWorker';
// import logger from '@/shared/core/logger';
import { consumeQueue } from '@/shared/messaging/consumeQueue';
import { mailHandler } from '@/shared/messaging/handlers/mail.handler';
import { userCreatedHandler } from '@/shared/messaging/handlers/userCreated.handler';

async function start() {
  // logger.info('🚀 Iniciando worker genérico...');

  const queues = [
    { name: 'sendMail', handler: mailHandler },
    { name: 'userCreated', handler: userCreatedHandler },
    // adicione mais aqui
  ];

  await Promise.all(queues.map(({ name, handler }) => consumeQueue(name, handler)));
}

bootstrapWorker('GenericQueueConsumer', async () => {
  await start();
});
