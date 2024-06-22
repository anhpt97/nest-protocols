import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RabbitmqService } from './rabbitmq.service';

@ApiTags('rabbitmq')
@Controller('rabbitmq')
export class RabbitmqController {
  constructor(private rabbitmqService: RabbitmqService) {}

  @Post('send')
  send() {
    return this.rabbitmqService.send(new Date().toLocaleString());
  }
}
