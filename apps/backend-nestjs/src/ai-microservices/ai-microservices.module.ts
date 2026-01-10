import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AiMicroservicesService } from './ai-microservices.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AI_MICROSERVICES_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'ai_microservices',
          protoPath: join(__dirname, './proto/ai-microservices.proto'),
        },
      },
    ]),
  ],
  providers: [AiMicroservicesService],
  exports: [AiMicroservicesService],
})
export class AiMicroservicesModule {}
