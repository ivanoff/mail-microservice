export type SendType = {
  email: string;
  smtpName?: string;
  templateName?: string;
  data?: Record<string, any>;
  callback?: (error: Error | null, result: any) => void;
};

export type SmtpType = {
  from: string;
  host: string;
  port: number;
  user: string;
  password: string;
  secure?: boolean;
  tls?: boolean;
};

export type TemplateType = {
  subject: string;
  text?: string;
  html?: string;
};

export type RequestType = {
  correlationId: string;
  smtp?: Record<string, SmtpType>;
  template?: Record<string, string>;
  send?: SendType;
}

export type ResultItemType = { ok: boolean } | { error: any };

export type ResultType = {
  smtp?: ResultItemType;
  template?: ResultItemType;
  send?: ResultItemType;
}
