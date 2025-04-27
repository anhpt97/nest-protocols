import { IoAdapter } from '@nestjs/platform-socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { Redis } from 'ioredis';
import { REDIS_HOST, REDIS_PORT } from '../constants';

export class RedisIoAdapter extends IoAdapter {
  createIOServer(port: number): any {
    const redis = new Redis({
      host: REDIS_HOST,
      port: REDIS_PORT,
    });
    return super
      .createIOServer(port)
      .adapter(createAdapter(redis, redis.duplicate()));
  }
}
