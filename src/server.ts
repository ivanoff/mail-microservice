import { rabbitmqService, RedisService, emailService } from './services';
import { RequestType, ResultType } from './types';

const redisService = new RedisService();

async function main() {

  await rabbitmqService.connect();
  console.log('Connected');

  rabbitmqService.consumeRequestQueue(async (msg) => {
    if (!msg) return;

    const { correlationId, smtp, template, send }: RequestType = JSON.parse(msg.content.toString());
    const result: ResultType = {};

    if (smtp) {
      try {
        for(const [name, config] of Object.entries(smtp)) {
          if (!config || !Object.keys(config)) await redisService.deleteSmtpConfig(name);
          else await redisService.setSmtpConfig(name, config);
        }
        result.smtp = { ok: true };
      } catch(error) {
        result.smtp = { error };
      }
    }

    if (template) {
      try {
        for(const [name, content] of Object.entries(template)) {
          if (!content || !Object.keys(content)) await redisService.deleteEmailTemplate(name);
          else await redisService.setEmailTemplate(name, content);
        }
        result.template = { ok: true };
      } catch(error) {
        result.template = { error };
      }
    }

    if (send) {
      const smtpConfig = await redisService.getSmtpConfig(send.smtpName || 'default');
      const tpl = await redisService.getEmailTemplate(send.templateName || 'default');
      if (smtpConfig) {
        result.send = await emailService.sendEmail(send, smtpConfig, tpl);
      } else {
        result.send = { error: `SMTP config ${send.smtpName || 'default'} not found` };
      }
    }

    await rabbitmqService.publishResult({ correlationId, result });
    rabbitmqService.acknowledgeMessage(msg);
  });
}

main().catch(console.error);
