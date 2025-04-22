import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MessagesService {
  constructor(private readonly mailerService: MailerService) {}

  async sendQuestionEmail(to: string, message: string, lessonId: number) {
    return this.mailerService.sendMail({
      to,
      subject: `New question about lesson #${lessonId}`,
      text: message,
      html: `
        <p><strong>You've got a new question about lesson #${lessonId}:</strong></p>
        <p>${message}</p>
      `,
    });
  }
}

