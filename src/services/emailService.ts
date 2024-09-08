import nodemailer from 'nodemailer';
import { SendType, SmtpType, TemplateType, ResultItemType } from '../types';
import Mustache from 'mustache';

class EmailService {
  async sendEmail(request: SendType, smtpConfig: SmtpType, template: TemplateType): Promise<ResultItemType> {

    const { user, password: pass, ...transportConfig } = smtpConfig;
    const auth = { user, pass };

    const transporter = nodemailer.createTransport({ auth, ...transportConfig });

    const t = {};
    for (const key of Object.keys(template)) {
      t[`${key}`] = Mustache.render(template[`${key}`], request.data);
    }

    const mailOptions = {
      from: smtpConfig.from,
      to: request.email,
      ...t,
    };

    try {
      await transporter.sendMail(mailOptions);
      return { ok: true };
    } catch (error) {
      return { error };
    }
  }
}

export const emailService = new EmailService();
