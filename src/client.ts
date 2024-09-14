import amqp, { Connection, Channel } from 'amqplib';
import { v4 as uuidv4 } from 'uuid';
import { SendType, SmtpType, TemplateType } from './types';

class EmailServiceClient {
  private connection: Connection | null = null;
  private channel: Channel | null = null;
  private readonly url: string;
  private readonly queues: {
    request: string;
    response: string;
  };
  private callbacks: Record<string, (error: Error | null, result?: any) => void> = {};

  constructor(
    url: string,
    queues: {
      request: string;
      response: string;
    }
  ) {
    this.url = url;
    this.queues = queues;
  }

  async connect(): Promise<void> {
    try {
      this.connection = await amqp.connect(this.url);
      this.channel = await this.connection.createChannel();

      await this.channel.assertQueue(this.queues.response);
      this.channel.consume(this.queues.response, (msg) => {
        if (msg) {
          const content = JSON.parse(msg.content.toString());

          const callback = this.callbacks[`${content.correlationId}`];
          if (callback) {
            callback(content.result.send.error, content.result);
            delete this.callbacks[`${content.correlationId}`];
          }

          this.channel?.ack(msg);
        }
      });

    } catch (error) {
      console.error('Error connecting to RabbitMQ:', error);
      throw error;
    }
  }

  async addSMTPConfig(name: string, config: SmtpType): Promise<void> {
    if (!this.channel) {
      throw new Error('Not connected to RabbitMQ');
    }

    const correlationId = uuidv4();
    const message = { correlationId, smtp: { [name] : config } };

    await this.channel.assertQueue(this.queues.request);
    this.channel.sendToQueue(this.queues.request, Buffer.from(JSON.stringify(message)));
  }

  async addTemplate(name: string, template: TemplateType): Promise<void> {
    if (!this.channel) {
      throw new Error('Not connected to RabbitMQ');
    }

    const correlationId = uuidv4();
    const message = { correlationId, template: { [name] : template } };

    await this.channel.assertQueue(this.queues.request);
    this.channel.sendToQueue(this.queues.request, Buffer.from(JSON.stringify(message)));
  }

  async sendEmail({ email, templateName, data, smtpName, callback }: SendType): Promise<void> {
    if (!this.channel) {
      throw new Error('Not connected to RabbitMQ');
    }

    const correlationId = uuidv4();
    const message = {
      correlationId,
      send: {
        email,
        clientName: smtpName || 'default',
        templateName,
        data: data || {},
      },
    };

    if (callback) this.callbacks[`${correlationId}`] = callback;

    await this.channel.assertQueue(this.queues.request);
    this.channel.sendToQueue(this.queues.request, Buffer.from(JSON.stringify(message)));

    // ((cId) => setTimeout(() => {
    //   if (!this.callbacks[`${cId}`]) return;
    //   this.callbacks[`${cId}`](new Error('Timeout'));
    //   delete this.callbacks[`${cId}`];
    // }, 60 * 1000))(correlationId);
  }

  async sendEmailAndWaitForResult(options: SendType): Promise<void> {
    return new Promise(async (resolve, reject) => {
      options.callback = (error, result) => error ? reject(error) : resolve(result);
      await this.sendEmail(options);
    })
  }

  async close(): Promise<void> {
    if (this.channel) {
      await this.channel.close();
    }
    if (this.connection) {
      await this.connection.close();
    }
  }
}

export default EmailServiceClient;
