import amqp from 'amqplib';
import { config } from '../config';

class RabbitMQService {
  private connection: amqp.Connection | null = null;
  private channel: amqp.Channel | null = null;
  queues: { request: string; response: string; };

  async connect(): Promise<void> {

    this.connection = await amqp.connect(config.rabbitMQ.url);
    this.channel = await this.connection.createChannel();
    this.queues = config.rabbitMQ.queues;

    await this.channel.assertQueue(this.queues.request);
    await this.channel.assertQueue(this.queues.response);

    await this.channel.prefetch(1);
  }

  async consumeRequestQueue(callback: (msg: amqp.ConsumeMessage | null) => void): Promise<void> {
    if (!this.channel) throw new Error('Channel not initialized');
    await this.channel.consume(this.queues.request, callback, { noAck: false });
  }

  async publishResult(result: any): Promise<void> {
    if (!this.channel) throw new Error('Channel not initialized');
    await this.channel.sendToQueue(this.queues.response, Buffer.from(JSON.stringify(result)), { persistent: true });
  }

  async acknowledgeMessage(msg: amqp.ConsumeMessage): Promise<void> {
    if (!this.channel) throw new Error('Channel not initialized');
    this.channel.ack(msg);
  }
}

export const rabbitmqService = new RabbitMQService();
