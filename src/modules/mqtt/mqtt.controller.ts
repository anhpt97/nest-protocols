import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MqttService } from './mqtt.service';

@ApiTags('mqtt')
@Controller('mqtt')
export class MqttController {
  constructor(private mqttService: MqttService) {}

  @Post('subscribe')
  subscribe() {
    return this.mqttService.subscribe('presence');
  }

  @Post('publish')
  publish() {
    return this.mqttService.publish('presence', new Date().toLocaleString());
  }
}
