import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { HmplController } from './hmpl.controller';
import { AppService } from './app.service';
import { AiMicroservicesModule } from './ai-microservices/ai-microservices.module';
import { BlockchainServiceModule } from './blockchain-service/blockchain-service.module';

@Module({
  imports: [AiMicroservicesModule, BlockchainServiceModule],
  controllers: [AppController, HmplController],
  providers: [AppService],
})
export class AppModule { }
