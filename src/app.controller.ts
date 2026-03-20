import { Controller, Get } from '@nestjs/common';
import { LoggerService } from '@/common/logger';

@Controller()
export class AppController {
  constructor(private readonly logger: LoggerService) {}

  @Get('/debug-sentry')
  getError() {
    this.logger.error('User triggered test log bro!!!');
    throw new Error('My first Sentry error!');
  }
}
