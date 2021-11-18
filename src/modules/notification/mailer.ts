const mailer = require('@sendgrid/mail');

interface IBaseEmailSendOption {
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  attachments: Object[] | null;
}

interface IEmailSendOptions extends IBaseEmailSendOption {
  html: string;
  subject: string;
}

interface IDynamicTemplateData {
  [x: string]: string | number | boolean | Date;
}

interface ITemplateOptions extends IBaseEmailSendOption {
  templateId?: string;
  dynamic_template_data: IDynamicTemplateData;
}

export class MailerService {
  // Use the email address or domain you verified above
  private readonly fromEmail: string = `${process.env.MAIL_FROM}`;
  constructor() {
    mailer.setApiKey(`${process.env.SENDGRID_API_KEY}`);
  }

  public async send(options: IEmailSendOptions): Promise<void> {
    const msg = {
      from: this.fromEmail,
      to: options.to,
      cc: options.cc,
      bcc: options.bcc,
      subject: options.subject,
      html: options.html,
      attachments: options.attachments ? options.attachments : [],
    };

    await mailer.send(msg);
  }

  public async sendToTemplate(options: ITemplateOptions): Promise<void> {
    if (!options.templateId) {
      throw new Error('Template Info required');
    }

    const msg = {
      from: this.fromEmail,
      to: options.to,
      cc: options.cc,
      bcc: options.bcc,
      templateId: options.templateId,
      dynamic_template_data: options.dynamic_template_data,
      attachments: options.attachments ? options.attachments : [],
    };

    await mailer.send(msg);
  }
}
