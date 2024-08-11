import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventGateway } from './event.gateway';

@Module({
  controllers: [EventController],
  providers: [EventGateway],
})
export class EventModule {}
