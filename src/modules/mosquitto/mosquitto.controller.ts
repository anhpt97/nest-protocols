import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MosquittoService } from './mosquitto.service';

@ApiTags('mosquitto')
@Controller('mosquitto')
export class MosquittoController {
  constructor(private mosquittoService: MosquittoService) {}

  @Post('subscribe')
  subscribe() {
    return this.mosquittoService.subscribe('presence');
  }

  @Post('publish')
  publish() {
    return this.mosquittoService.publish(
      'presence',
      new Date().toLocaleString(),
    );
  }
}
