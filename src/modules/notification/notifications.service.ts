import { isArray } from 'lodash';
import { Twilio } from 'twilio';
import { MailerService } from './mailer';

interface IBaseEmailOption {
  cc?: string | string[];
  bcc?: string | string[];
  attachments: Object[] | null;
}

/* eslint-disable @typescript-eslint/restrict-template-expressions */
interface IEmailOptions extends IBaseEmailOption {
  template_id?: string;
  data: IDynamicTemplateData;
  attachments: Object[] | null;
}

interface IDynamicTemplateData {
  [x: string]: string | number | boolean | Date;
}

interface ICustomEmailOptions extends IBaseEmailOption {
  subject: string;
  body: string;
}

export class NotificationService {
  private readonly mailerService: MailerService;

  constructor() {
    this.mailerService = new MailerService();
  }

  async sendCustomEmail(
    to: string[],
    options: ICustomEmailOptions
  ): Promise<void> {
    const emailRequestPayload = {
      to,
      cc: options.cc,
      bcc: options.bcc,
      subject: options.subject,
      html: options.body,
      attachments: options.attachments ? options.attachments : [],
    };
    await this.mailerService.send(emailRequestPayload);
  }

  async sendEmail(
    to: string | string[],
    options: IEmailOptions
  ): Promise<void> {
    if (!to) {
      return;
    }

    const emails = isArray(to) ? to : [to];
    try {
      await this.mailerService.sendToTemplate({
        to,
        cc: options.cc,
        bcc: options.bcc,
        templateId: options.template_id,
        dynamic_template_data: options?.data,
        attachments: options.attachments ? options.attachments : [],
      });
    } catch ({ message }) {
      console.error(`Couldn't send email to ${emails}`, message);
    }
  }

  public async sendSMS(phone: string, message: string): Promise<string> {
    console.log(`Sending SMS to ${phone}`);

    const twilio = new Twilio(
      `${process.env.TWILIO_ACCOUNT_ID}`,
      `${process.env.TWILIO_AUTH_TOKEN}`
    );

    const result = await twilio.messages.create({
      body: message,
      to: phone,
      from: `${process.env.TWILIO_SENDER_PHONE}`,
    });
    if (['undelivered', 'failed'].includes(result.status) || result.errorCode) {
      throw new Error('Failed to send message to the phone number provided');
    }

    return result.sid;
  }
}
