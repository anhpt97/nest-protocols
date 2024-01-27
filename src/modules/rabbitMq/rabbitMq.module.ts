import { Module } from '@nestjs/common';
import { RabbitMqController } from './rabbitMq.controller';
import { RabbitMqService } from './rabbitMq.service';

@Module({
  controllers: [RabbitMqController],
  providers: [RabbitMqService],
})
export class RabbitMqModule {}
