import { EmailRequest, SmtpConfig } from './types';
declare class EmailServiceClient {
    private connection;
    private channel;
    private readonly url;
    private readonly queues;
    private callbacks;
    constructor(url: string, queues: {
        smtp: string;
        template: string;
        request: string;
        response: string;
    });
    connect(): Promise<void>;
    addSMTPConfig(name: string, config: SmtpConfig): Promise<void>;
    addTemplate(name: string, template: string): Promise<void>;
    sendEmail({ email, templateName, data, smtpName, callback }: EmailRequest): Promise<void>;
    close(): Promise<void>;
}
export default EmailServiceClient;
//# sourceMappingURL=client.d.ts.map