import { SendType, SmtpType, TemplateType } from './types';
declare class EmailServiceClient {
    private connection;
    private channel;
    private readonly url;
    private readonly queues;
    private callbacks;
    constructor(url: string, queues: {
        request: string;
        response: string;
    });
    connect(): Promise<void>;
    addSMTPConfig(name: string, config: SmtpType): Promise<void>;
    addTemplate(name: string, template: TemplateType): Promise<void>;
    sendEmail({ email, templateName, data, smtpName, callback }: SendType): Promise<void>;
    sendEmailAndWaitForResult(options: SendType): Promise<void>;
    close(): Promise<void>;
}
export default EmailServiceClient;
//# sourceMappingURL=client.d.ts.map