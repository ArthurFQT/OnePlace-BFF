import amqp from 'amqplib';

export class RabbitMQProducer {
  private static channel: amqp.Channel;

  static async connect() {
    const conn = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
    RabbitMQProducer.channel = await conn.createChannel();
  }

  static async sendToQueue(queue: string, message: Record<string, any>) {
    if (!RabbitMQProducer.channel) await RabbitMQProducer.connect();
    await RabbitMQProducer.channel.assertQueue(queue, { durable: true });
    RabbitMQProducer.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
      persistent: true,
    });
  }

  static async sendBatch(queue: string, messages: Record<string, any>[]) {
    for (const message of messages) {
      await RabbitMQProducer.sendToQueue(queue, message);
    }
  }
}
