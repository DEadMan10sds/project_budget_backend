import { Controller, Get } from '@nestjs/common';
import { EmailsService } from './emails.service';

@Controller('emails')
export class EmailsController {
  constructor(private readonly emailsService: EmailsService) {}

  @Get('/send')
  sendEmail() {
    return this.emailsService.sendEmail({
      template: 'forgot-password',
      context: { message: 'Hello there general kenobi' },
      to: 'adan.sanchez@script.mx',
    });
  }
}
