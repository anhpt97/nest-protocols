import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EventGateway } from './event.gateway';

export const ROOM_ID = '1';

@ApiTags('event')
@Controller('event')
export class EventController {
  constructor(private eventGateway: EventGateway) {}

  @Post('emit')
  emit() {
    return this.eventGateway.emit(ROOM_ID, {
      message: new Date().toLocaleString(),
    });
  }
}
