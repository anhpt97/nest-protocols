import { Module, ValidationPipe } from '@nestjs/common';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AllExceptionsFilter } from './common/filters';
import { dataSource } from './data-source';
import { AuthModule } from './modules/auth/auth.module';
import { CommanderModule } from './modules/commander/commander.module';
import { DatabaseModule } from './modules/database/database.module';
import { EventModule } from './modules/event/event.module';
import { MqttModule } from './modules/mqtt/mqtt.module';
import { RabbitmqModule } from './modules/rabbitmq/rabbitmq.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot(dataSource.options),
    AuthModule,
    CommanderModule,
    DatabaseModule,
    EventModule,
    MqttModule,
    RabbitmqModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
