import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RabbitMqService } from './rabbitMq.service';

@ApiTags('rabbitmq')
@Controller('rabbitmq')
export class RabbitMqController {
  constructor(private rabbitMqService: RabbitMqService) {}

  @Post('send')
  send() {
    return this.rabbitMqService.send(new Date().toLocaleString());
  }
}
