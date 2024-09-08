import Redis from 'ioredis';
import { config } from '../config';
import { SmtpType, TemplateType } from '../types';

export class RedisService {
  private client: Redis;

  constructor() {
    this.client = new Redis(config.redis);
  }

  async getSmtpConfig(clientName: string): Promise<SmtpType | null> {
    const config = await this.client.get(`smtp-${clientName}`);
    return config ? JSON.parse(config) : null;
  }

  async setSmtpConfig(clientName: string, config: SmtpType): Promise<void> {
    await this.client.set(`smtp-${clientName}`, JSON.stringify(config));
  }

  async deleteSmtpConfig(clientName: string): Promise<void> {
    await this.client.del(`smtp-${clientName}`);
  }

  async getEmailTemplate(templateName: string): Promise<TemplateType> {
    const template = await this.client.get(`template-${templateName}`);
    return template ? JSON.parse(template) : null;
  }

  async setEmailTemplate(templateName: string, content: string): Promise<void> {
    await this.client.set(`template-${templateName}`, JSON.stringify(content));
  }

  async deleteEmailTemplate(templateName: string): Promise<void> {
    await this.client.del(`template-${templateName}`);
  }
}
