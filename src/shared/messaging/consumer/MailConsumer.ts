import amqp from 'amqplib';
import path from 'path';

import { MailProvider } from '@/shared/providers/mail/services/MailProvider';

export async function startMailConsumer() {
  const conn = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
  const channel = await conn.createChannel();
  const queue = 'mail_queue';

  await channel.assertQueue(queue, { durable: true });

  channel.consume(queue, async msg => {
    if (!msg) return;

    const data = JSON.parse(msg.content.toString());

    const provider = new MailProvider();
    await provider.sendMail({
      to: data.to,
      subject: data.subject || 'Assunto padrão',
      templatePath: path.resolve(__dirname, '../../../shared/mail/templates/welcome.hbs'),
      variables: data.variables,
    });

    channel.ack(msg);
  });
}
