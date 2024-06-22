import { Injectable } from '@nestjs/common';
import { Channel, connect } from 'amqplib';
import { AMQP_PREFETCH_COUNT, AMQP_URL } from '~/common/constants';

@Injectable()
export class RabbitmqService {
  private channel: Channel;

  private queue = 'hello';

  constructor() {
    void (async () => {
      const connection = await connect(AMQP_URL);
      this.channel = await connection.createChannel();

      await this.channel.assertQueue(this.queue);

      if (AMQP_PREFETCH_COUNT) {
        void this.channel.prefetch(AMQP_PREFETCH_COUNT);
      }

      void this.channel.consume(this.queue, (msg) => {
        const { content } = msg;
        if (content) {
          // eslint-disable-next-line no-console
          console.log(JSON.parse(content.toString()));
          this.channel.ack(msg);
        }
      });
    })();
  }

  // @Interval(1000)
  send(data: any) {
    // this.channel.sendToQueue(
    //   this.queue,
    //   Buffer.from(JSON.stringify(new Date().toLocaleString())),
    // );
    this.channel.sendToQueue(this.queue, Buffer.from(JSON.stringify(data)));
  }
}
