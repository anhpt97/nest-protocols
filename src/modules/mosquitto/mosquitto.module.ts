import { Module } from '@nestjs/common';
import { MosquittoController } from './mosquitto.controller';
import { MosquittoService } from './mosquitto.service';

@Module({
  controllers: [MosquittoController],
  providers: [MosquittoService],
})
export class MosquittoModule {}
