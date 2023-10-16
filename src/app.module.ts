import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import configuration from 'shared/config/configuration';
import { EventsGateway } from './events.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    })
  ],
  controllers: [AppController],
  providers: [AppService, EventsGateway],
})
export class AppModule {}
