/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { BadRequestException, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailsService {
  constructor(private readonly mailService: MailerService) {}

  async sendEmail(content: any) {
    try {
      const resultEmail = await this.mailService.sendMail({
        ...content,
        from: 'Adán Sánchez <info@beeprovi.com>',
      });
      return resultEmail;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Error sending email');
    }
  }
}
