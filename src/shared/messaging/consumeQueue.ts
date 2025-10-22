import logger from '@/shared/core/logger';

import { getRabbitChannel } from './rabbitClient';

export async function consumeQueue(queue: string, handler: (data: any) => Promise<void>) {
  const channel = await getRabbitChannel();
  await channel.assertQueue(queue, { durable: true });

  channel.consume(queue, async msg => {
    if (!msg) return;

    const content = JSON.parse(msg.content.toString());

    try {
      await handler(content);
      channel.ack(msg);
    } catch (err) {
      logger.error(`❌ Erro no handler da fila "${queue}":`, err);
      channel.nack(msg, false, false); // descarta
    }
  });

  logger.info(`🟢 Escutando fila: ${queue}`);
}
