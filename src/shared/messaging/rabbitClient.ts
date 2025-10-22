import amqplib from 'amqplib';

let channel: amqplib.Channel;

export async function getRabbitChannel(): Promise<amqplib.Channel> {
  if (channel) return channel;

  const connection = await amqplib.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
  channel = await connection.createChannel();

  return channel;
}
