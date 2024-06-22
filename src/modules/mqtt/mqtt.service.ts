import { Injectable } from '@nestjs/common';
import { connect, MqttClient } from 'mqtt';
import { MQTT_URL } from '~/common/constants';

@Injectable()
export class MqttService {
  private client: MqttClient;

  constructor() {
    this.client = connect(MQTT_URL);
  }

  subscribe(topic: string) {
    this.client = connect(MQTT_URL);
    this.client.on('connect', () => {
      this.client.subscribe(topic);
    });
    this.client.on('message', (topic, message) => {
      // eslint-disable-next-line no-console
      console.log(message.toString());
    });
  }

  // @Interval(1000)
  publish(topic: string, message: string) {
    // this.client.publish('presence', new Date().toLocaleString());
    this.client.publish(topic, message);
  }
}
