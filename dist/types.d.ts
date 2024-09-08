export type EmailRequest = {
    correlationId: string;
    email: string;
    smtpName?: string;
    templateName: string;
    data?: Record<string, any>;
    callback?: (error: Error | null, result: any) => void;
};
export type EmailTemplate = {
    name: string;
    content: string;
};
export type SmtpConfig = {
    from: string;
    host: string;
    port: number;
    user: string;
    password: string;
    tls_rejectunauth?: boolean;
};
//# sourceMappingURL=types.d.ts.map